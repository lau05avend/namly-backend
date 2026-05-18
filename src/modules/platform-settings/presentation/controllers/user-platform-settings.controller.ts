import { Body, Controller, Get, Patch } from '@nestjs/common';
import { PlatformSettingsService } from '../../application/platform-settings.service';
import type { PlatformSettingsDto } from '../dto/platform-settings.dto';
import { UpdatePlatformSettingsDto } from '../dto/update-platform-settings.dto';
import { PlatformSettingsMapper } from '../mappers/platform-settings.mapper';
import { CurrentProfileId } from '@/common/decorators/current-profile-id.decorator';

@Controller('user')
export class UserPlatformSettingsController {
  constructor(private readonly platformSettingsService: PlatformSettingsService) {}

  @Get('platform-settings')
  async getPlatformSettings(@CurrentProfileId() profileId: string): Promise<PlatformSettingsDto> {
    const settings = await this.platformSettingsService.getByUserId(profileId);

    return PlatformSettingsMapper.toDto(settings);
  }

  @Patch('platform-settings')
  async patchPlatformSettings(
    @CurrentProfileId() profileId: string,
    @Body() body: UpdatePlatformSettingsDto,
  ): Promise<PlatformSettingsDto> {
    const settings = await this.platformSettingsService.updateByUserId(profileId, body);

    return PlatformSettingsMapper.toDto(settings);
  }
}
