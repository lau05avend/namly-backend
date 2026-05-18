
import { Module } from '@nestjs/common';
import { SettingsService } from './application/settings.service';

@Module({
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
