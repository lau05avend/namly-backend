import { Module } from '@nestjs/common';
import { OnboardingController } from './presentation/controllers/onboarding.controller';
import { OnboardingService } from './application/services/onboarding.service';
import { OnboardingRepository } from './infrastructure/repositories/onboarding.repository';

@Module({
  controllers: [OnboardingController],
  providers: [OnboardingService, OnboardingRepository],
})
export class OnboardingModule {}
