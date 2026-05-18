import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import type { PlatformSettingsEntity } from '../../domain/entities/platform-settings.entity';
import type { UpdatePlatformSettingsParams } from '../../domain/interfaces/update-platform-settings-params.interface';

const settingsSelect = {
  weightUnitId: true,
  volumeUnitId: true,
  language: true,
  theme: true,
} as const;

type SettingsRecord = {
  weightUnitId: string | null;
  volumeUnitId: string | null;
  language: string | null;
  theme: string | null;
};

@Injectable()
export class UserPlatformSettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProfileId(profileId: string): Promise<PlatformSettingsEntity | null> {
    const record = await this.prisma.userPlatformSetting.findUnique({
      where: { profileId },
      select: settingsSelect,
    });

    if (!record) {
      return null;
    }

    return this.toEntity(record);
  }

  async savePartial(
    profileId: string,
    data: UpdatePlatformSettingsParams,
  ): Promise<PlatformSettingsEntity> {
    const existing = await this.prisma.userPlatformSetting.findUnique({
      where: { profileId },
      select: { id: true },
    });

    if (!existing) {
      const record = await this.prisma.userPlatformSetting.create({
        data: {
          profileId,
          weightUnitId: data.weightUnitId ?? null,
          volumeUnitId: data.volumeUnitId ?? null,
          language: data.language ?? null,
          theme: data.theme ?? null,
        },
        select: settingsSelect,
      });

      return this.toEntity(record);
    }

    const record = await this.prisma.userPlatformSetting.update({
      where: { profileId },
      data: {
        ...(data.weightUnitId && { weightUnitId: data.weightUnitId }),
        ...(data.volumeUnitId && { volumeUnitId: data.volumeUnitId }),
        ...(data.language && { language: data.language }),
        ...(data.theme && { theme: data.theme }),
      },
      select: settingsSelect,
    });

    return this.toEntity(record);
  }

  private toEntity(record: SettingsRecord): PlatformSettingsEntity {
    return {
      weightUnitId: record.weightUnitId,
      volumeUnitId: record.volumeUnitId,
      language: record.language,
      theme: record.theme,
    };
  }
}
