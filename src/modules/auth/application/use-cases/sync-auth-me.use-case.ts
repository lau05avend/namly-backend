import { BadRequestException, Injectable } from '@nestjs/common';
import type { User } from '@supabase/supabase-js';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { ProfilesService } from '@modules/profiles/application/profiles.service';
import type { AuthMeResultEntity } from '../../domain/entities/auth-me-result.entity';
import {
  extractAuthJwtClaims,
  resolveInitialDisplayName,
} from '../../domain/utils/extract-auth-jwt-claims.util';
import { AuthIdentityRepository } from '../../infrastructure/repositories/auth-identity.repository';

export type SyncAuthMeParams = {
  displayName?: string;
};

@Injectable()
export class SyncAuthMeUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authIdentityRepository: AuthIdentityRepository,
    private readonly profilesService: ProfilesService,
  ) {}

  async execute(authUser: User, params: SyncAuthMeParams): Promise<AuthMeResultEntity> {
    const claims = extractAuthJwtClaims(authUser);
    const now = new Date();

    const existing = await this.authIdentityRepository.findByAuthUserId(claims.authUserId);

    if (existing) {
      const emailChanged = existing.email ? claims.email : existing.email;
      const record = await this.authIdentityRepository.updateEmailAndLastSignIn(existing.id, {
        email: emailChanged,
        lastSignIn: now,
      });

      return this.toResult(record.profile, record.email, false);
    }

    this.assertRequiredClaimsForCreate(claims);

    try {
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
          lastSignIn: now,
        });
      });

      return this.toResult(record.profile, record.email, true);
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

        return this.toResult(record.profile, record.email, false);
      }

      throw error;
    }
  }

  private assertRequiredClaimsForCreate(claims: ReturnType<typeof extractAuthJwtClaims>): void {
    if (!claims.provider || !claims.externalId) {
      throw new BadRequestException('JWT is missing required provider metadata');
    }
  }

  private isUniqueConstraintViolation(error: unknown): boolean {
    return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
  }

  private toResult(
    profile: { id: string; displayName: string | null; avatarUrl: string | null },
    email: string | null,
    isNewUser: boolean,
  ): AuthMeResultEntity {
    return {
      id: profile.id,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      email,
      // TODO: pendiente implementar estado de completado del onboarding
      hasCompletedOnboarding: false,
      isNewUser,
    };
  }
}
