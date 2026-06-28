import { Module } from '@nestjs/common';
import { StorageModule } from '@infrastructure/storage/storage.module';
import { DeleteProfileAccountUseCase } from './application/use-cases/delete-profile-account.use-case';
import { ProfilesService } from './application/profiles.service';
import { ProfileResetRepository } from './infrastructure/repositories/profile-reset.repository';
import { ProfileRepository } from './infrastructure/repositories/profile.repository';
import { ProfileController } from './presentation/controllers/profile.controller';

@Module({
  imports: [StorageModule],
  controllers: [ProfileController],
  providers: [
    ProfilesService,
    ProfileRepository,
    ProfileResetRepository,
    DeleteProfileAccountUseCase,
  ],
  exports: [ProfilesService],
})
export class ProfilesModule {}
