import { Injectable } from '@nestjs/common';
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
