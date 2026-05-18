import { Module } from '@nestjs/common';
import { PlatformSettingsService } from './application/platform-settings.service';
import { UserPlatformSettingsRepository } from './infrastructure/repositories/user-platform-settings.repository';
import { UserPlatformSettingsController } from './presentation/controllers/user-platform-settings.controller';

@Module({
  controllers: [UserPlatformSettingsController],
  providers: [PlatformSettingsService, UserPlatformSettingsRepository],
  exports: [PlatformSettingsService],
})
export class PlatformSettingsModule {}
