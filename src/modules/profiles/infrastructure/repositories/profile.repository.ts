import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import type { ProfileEntity } from '../../domain/entities/profile.entity';
import type { UpdateProfileParams } from '../../domain/interfaces/update-profile-params.interface';

const profileSelect = {
  id: true,
  displayName: true,
  avatarUrl: true,
} as const;

type ProfileRecord = {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
};

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createRecord(
    tx: Prisma.TransactionClient,
    data: { displayName: string | null; avatarUrl: string | null; profileId: string },
  ): Promise<ProfileEntity> {
    const record = await tx.profile.create({
      data: {
        id: data.profileId,
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
      },
      select: profileSelect,
    });

    return this.toEntity(record);
  }

  async findById(profileId: string): Promise<ProfileEntity | null> {
    const record = await this.prisma.profile.findUnique({
      where: { id: profileId },
      select: profileSelect,
    });

    if (!record) {
      return null;
    }

    return this.toEntity(record);
  }

  async updateById(profileId: string, data: UpdateProfileParams): Promise<ProfileEntity | null> {
    try {
      const record = await this.prisma.profile.update({
        where: { id: profileId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
        select: profileSelect,
      });

      return this.toEntity(record);
    } catch {
      return null;
    }
  }

  private toEntity(record: ProfileRecord): ProfileEntity {
    return {
      id: record.id,
      displayName: record.displayName,
      avatarUrl: record.avatarUrl,
    };
  }
}
