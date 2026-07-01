import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';

export type GuestSessionRecord = {
  id: string;
  profileId: string;
  deviceId: string;
  expiresAt: Date;
  lastActiveAt: Date;
};

@Injectable()
export class GuestSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveByDeviceId(deviceId: string): Promise<GuestSessionRecord | null> {
    const record = await this.prisma.guestSession.findFirst({
      where: {
        deviceId,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        profileId: true,
        deviceId: true,
        expiresAt: true,
        lastActiveAt: true,
      },
    });

    return record;
  }

  async findByProfileId(profileId: string): Promise<GuestSessionRecord | null> {
    const record = await this.prisma.guestSession.findFirst({
      where: { profileId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        profileId: true,
        deviceId: true,
        expiresAt: true,
        lastActiveAt: true,
      },
    });

    return record;
  }

  async createInTransaction(
    tx: Prisma.TransactionClient,
    params: {
      profileId: string;
      deviceId: string;
      expiresAt: Date;
    },
  ): Promise<GuestSessionRecord> {
    const record = await tx.guestSession.create({
      data: {
        profileId: params.profileId,
        deviceId: params.deviceId,
        expiresAt: params.expiresAt,
      },
      select: {
        id: true,
        profileId: true,
        deviceId: true,
        expiresAt: true,
        lastActiveAt: true,
      },
    });

    return record;
  }

  async touchLastActive(profileId: string): Promise<void> {
    await this.prisma.guestSession.updateMany({
      where: { profileId },
      data: {
        lastActiveAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async deleteByProfileId(
    profileId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;

    await client.guestSession.deleteMany({
      where: { profileId },
    });
  }
}
