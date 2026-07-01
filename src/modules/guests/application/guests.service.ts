import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { GUEST_SESSION_TTL_DAYS } from '../domain/constants/guest.constants';
import type { GuestSessionStateEntity } from '../domain/entities/guest-session-state.entity';
import {
  GuestSessionRepository,
  type GuestSessionRecord,
} from '../infrastructure/repositories/guest-session.repository';

@Injectable()
export class GuestsService {
  constructor(private readonly guestSessionRepository: GuestSessionRepository) {}

  async findActiveGuestByDeviceId(deviceId: string): Promise<GuestSessionRecord | null> {
    const normalized = deviceId.trim();

    if (!normalized) {
      return null;
    }

    return this.guestSessionRepository.findActiveByDeviceId(normalized);
  }

  async resolveGuestState(profileId: string): Promise<GuestSessionStateEntity> {
    const session = await this.guestSessionRepository.findByProfileId(profileId);

    if (!session) {
      return {
        isGuest: false,
        guestExpiresAt: null,
        isExpired: false,
      };
    }

    const now = new Date();
    const isExpired = session.expiresAt.getTime() <= now.getTime();

    return {
      isGuest: true,
      guestExpiresAt: session.expiresAt.toISOString(),
      isExpired,
    };
  }

  async startGuestSession(
    tx: Prisma.TransactionClient,
    profileId: string,
    deviceId: string,
  ): Promise<GuestSessionStateEntity> {
    const expiresAt = this.resolveExpiresAt();

    const session = await this.guestSessionRepository.createInTransaction(tx, {
      profileId,
      deviceId,
      expiresAt,
    });

    return {
      isGuest: true,
      guestExpiresAt: session.expiresAt.toISOString(),
      isExpired: false,
    };
  }

  async endGuestSession(profileId: string, tx?: Prisma.TransactionClient): Promise<void> {
    await this.guestSessionRepository.deleteByProfileId(profileId, tx);
  }

  async touchLastActive(profileId: string): Promise<void> {
    await this.guestSessionRepository.touchLastActive(profileId);
  }

  private resolveExpiresAt(): Date {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + GUEST_SESSION_TTL_DAYS);

    return expiresAt;
  }
}
