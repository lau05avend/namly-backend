import { Module } from '@nestjs/common';
import { ProfilesService } from './application/profiles.service';
import { ProfileRepository } from './infrastructure/repositories/profile.repository';
import { ProfileController } from './presentation/controllers/profile.controller';

@Module({
  controllers: [ProfileController],
  providers: [ProfilesService, ProfileRepository],
  exports: [ProfilesService],
})
export class ProfilesModule {}
