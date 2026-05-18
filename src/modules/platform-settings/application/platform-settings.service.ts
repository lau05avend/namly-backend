import { BadRequestException, Injectable } from '@nestjs/common';
import type { PlatformSettingsEntity } from '../domain/entities/platform-settings.entity';
import type { UpdatePlatformSettingsParams } from '../domain/interfaces/update-platform-settings-params.interface';
import { UserPlatformSettingsRepository } from '../infrastructure/repositories/user-platform-settings.repository';

const defaultSettings = (): PlatformSettingsEntity => ({
  weightUnitId: null,
  volumeUnitId: null,
  language: null,
  theme: null,
});

@Injectable()
export class PlatformSettingsService {
  constructor(private readonly userPlatformSettingsRepository: UserPlatformSettingsRepository) {}

  async getByUserId(userId: string): Promise<PlatformSettingsEntity> {
    const row = await this.userPlatformSettingsRepository.findByProfileId(userId);

    return row ?? defaultSettings();
  }

  async updateByUserId(
    userId: string,
    params: UpdatePlatformSettingsParams,
  ): Promise<PlatformSettingsEntity> {
    if (
      params.weightUnitId === undefined &&
      params.volumeUnitId === undefined &&
      params.language === undefined &&
      params.theme === undefined
    ) {
      throw new BadRequestException('At least one field must be provided');
    }

    return this.userPlatformSettingsRepository.savePartial(userId, params);
  }
}
