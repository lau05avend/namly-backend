import { BadRequestException, Injectable } from '@nestjs/common';
import type { User } from '@supabase/supabase-js';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { GuestsService } from '@modules/guests/application/guests.service';
import type { GuestSessionStateEntity } from '@modules/guests/domain/entities/guest-session-state.entity';
import type { GuestSessionRecord } from '@modules/guests/infrastructure/repositories/guest-session.repository';
import { ProfilesService } from '@modules/profiles/application/profiles.service';
import type { AuthMeResultEntity } from '../../domain/entities/auth-me-result.entity';
import {
  extractAuthJwtClaims,
  resolveInitialDisplayName,
} from '../../domain/utils/extract-auth-jwt-claims.util';
import { isAnonymousAuthUser } from '../../domain/utils/is-anonymous-auth-user.util';
import { AuthIdentityRepository } from '../../infrastructure/repositories/auth-identity.repository';

export type SyncAuthMeParams = {
  displayName?: string;
  deviceId?: string;
};

@Injectable()
export class SyncAuthMeUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authIdentityRepository: AuthIdentityRepository,
    private readonly profilesService: ProfilesService,
    private readonly guestsService: GuestsService,
  ) {}

  async execute(authUser: User, params: SyncAuthMeParams): Promise<AuthMeResultEntity> {
    const claims = extractAuthJwtClaims(authUser);
    const now = new Date();
    const isAnonymous = isAnonymousAuthUser(authUser);

    const existing = await this.authIdentityRepository.findByAuthUserId(claims.authUserId);

    if (existing) {
      const emailChanged = existing.email ? claims.email : existing.email;
      const record = await this.authIdentityRepository.updateEmailAndLastSignIn(existing.id, {
        email: emailChanged,
        lastSignIn: now,
      });

      if (!isAnonymous) {
        await this.guestsService.endGuestSession(record.profile.id);
      } else {
        await this.guestsService.touchLastActive(record.profile.id);
      }

      return this.toResult(record.profile, record.email, false);
    }

    this.assertRequiredClaimsForCreate(claims);

    try {
      const guestState = isAnonymous
        ? await this.createAnonymousUser(claims, params, now)
        : await this.createRegisteredUser(claims, params, now);

      return guestState.result;
    } catch (error) {
      if (this.isUniqueConstraintViolation(error)) {
        const raced = await this.authIdentityRepository.findByAuthUserId(claims.authUserId);

        if (!raced) {
          throw error;
        }

        const record = await this.authIdentityRepository.updateEmailAndLastSignIn(raced.id, {
          email: claims.email,
          lastSignIn: now,
        });

        if (!isAnonymous) {
          await this.guestsService.endGuestSession(record.profile.id);
        }

        return this.toResult(record.profile, record.email, false);
      }

      throw error;
    }
  }

  private async createAnonymousUser(
    claims: ReturnType<typeof extractAuthJwtClaims>,
    params: SyncAuthMeParams,
    lastSignIn: Date,
  ): Promise<{ result: AuthMeResultEntity }> {
    const deviceId = this.resolveDeviceId(params.deviceId, claims.authUserId);
    const activeGuestByDevice = await this.guestsService.findActiveGuestByDeviceId(deviceId);

    if (activeGuestByDevice) {
      if (activeGuestByDevice.profileId !== claims.authUserId) {
        return this.resumeAnonymousGuestByDevice(claims, lastSignIn, activeGuestByDevice);
      }

      return this.completeAnonymousRegistration(claims, params, lastSignIn, activeGuestByDevice);
    }

    const { record, guestState } = await this.prisma.$transaction(async (tx) => {
      const profile = await this.profilesService.createInitialProfile(tx, {
        profileId: claims.authUserId,
        displayName: resolveInitialDisplayName(params.displayName, claims),
        avatarUrl: claims.avatarUrl,
      });

      const identity = await this.authIdentityRepository.createRecord(tx, {
        profileId: profile.id,
        authUserId: claims.authUserId,
        provider: claims.provider,
        externalId: claims.externalId,
        email: claims.email,
        lastSignIn,
      });

      const sessionState = await this.guestsService.startGuestSession(tx, profile.id, deviceId);

      return { record: identity, guestState: sessionState };
    });

    const result = await this.toResult(record.profile, record.email, true, guestState);

    return { result };
  }

  private async resumeAnonymousGuestByDevice(
    claims: ReturnType<typeof extractAuthJwtClaims>,
    lastSignIn: Date,
    activeGuest: GuestSessionRecord,
  ): Promise<{ result: AuthMeResultEntity }> {
    const profileId = activeGuest.profileId;

    const profile = await this.prisma.profile.findUnique({
      where: { id: profileId },
      select: {
        id: true,
        displayName: true,
        avatarUrl: true,
      },
    });

    if (!profile) {
      throw new BadRequestException('Guest profile not found for this device');
    }

    const record = await this.prisma.$transaction(async (tx) => {
      await tx.authIdentity.deleteMany({
        where: {
          OR: [{ authUserId: claims.authUserId }, { profileId }],
        },
      });

      return this.authIdentityRepository.createRecord(tx, {
        profileId,
        authUserId: claims.authUserId,
        provider: claims.provider,
        externalId: claims.externalId,
        email: claims.email,
        lastSignIn,
      });
    });

    await this.guestsService.touchLastActive(profileId);

    const guestState: GuestSessionStateEntity = {
      isGuest: true,
      guestExpiresAt: activeGuest.expiresAt.toISOString(),
      isExpired: false,
    };

    const result = await this.toResult(record.profile, record.email, false, guestState);

    return { result };
  }

  private async completeAnonymousRegistration(
    claims: ReturnType<typeof extractAuthJwtClaims>,
    params: SyncAuthMeParams,
    lastSignIn: Date,
    activeGuest: GuestSessionRecord,
  ): Promise<{ result: AuthMeResultEntity }> {
    const record = await this.prisma.$transaction(async (tx) => {
      const existingProfile = await tx.profile.findUnique({
        where: { id: claims.authUserId },
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
        },
      });

      const profile =
        existingProfile ??
        (await this.profilesService.createInitialProfile(tx, {
          profileId: claims.authUserId,
          displayName: resolveInitialDisplayName(params.displayName, claims),
          avatarUrl: claims.avatarUrl,
        }));

      const identity = await this.authIdentityRepository.createRecord(tx, {
        profileId: profile.id,
        authUserId: claims.authUserId,
        provider: claims.provider,
        externalId: claims.externalId,
        email: claims.email,
        lastSignIn,
      });

      return identity;
    });

    await this.guestsService.touchLastActive(record.profile.id);

    const guestState: GuestSessionStateEntity = {
      isGuest: true,
      guestExpiresAt: activeGuest.expiresAt.toISOString(),
      isExpired: false,
    };

    const result = await this.toResult(record.profile, record.email, false, guestState);

    return { result };
  }

  private async createRegisteredUser(
    claims: ReturnType<typeof extractAuthJwtClaims>,
    params: SyncAuthMeParams,
    lastSignIn: Date,
  ): Promise<{ result: AuthMeResultEntity }> {
    const record = await this.prisma.$transaction(async (tx) => {
      const profile = await this.profilesService.createInitialProfile(tx, {
        profileId: claims.authUserId,
        displayName: resolveInitialDisplayName(params.displayName, claims),
        avatarUrl: claims.avatarUrl,
      });

      return this.authIdentityRepository.createRecord(tx, {
        profileId: profile.id,
        authUserId: claims.authUserId,
        provider: claims.provider,
        externalId: claims.externalId,
        email: claims.email,
        lastSignIn,
      });
    });

    const result = await this.toResult(record.profile, record.email, true);

    return { result };
  }

  private resolveDeviceId(deviceId: string | undefined, authUserId: string): string {
    const normalized = deviceId?.trim();

    if (normalized) {
      return normalized;
    }

    return authUserId;
  }

  private assertRequiredClaimsForCreate(claims: ReturnType<typeof extractAuthJwtClaims>): void {
    if (!claims.provider || !claims.externalId) {
      throw new BadRequestException('JWT is missing required provider metadata');
    }
  }

  private isUniqueConstraintViolation(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
  }

  private async toResult(
    profile: { id: string; displayName: string | null; avatarUrl: string | null },
    email: string | null,
    isNewUser: boolean,
    guestState?: GuestSessionStateEntity,
  ): Promise<AuthMeResultEntity> {
    const resolvedGuestState =
      guestState ?? (await this.guestsService.resolveGuestState(profile.id));
    const onboarding = await this.profilesService.getOnboardingStatus(profile.id);

    return {
      id: profile.id,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      email,
      hasCompletedOnboarding: onboarding?.hasCompletedOnboarding ?? false,
      isNewUser,
      isGuest: resolvedGuestState.isGuest,
      guestExpiresAt: resolvedGuestState.guestExpiresAt,
    };
  }
}
