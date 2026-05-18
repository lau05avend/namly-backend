import { Module } from '@nestjs/common';
import { OnboardingService } from './application/onboarding.service';

@Module({
  providers: [OnboardingService],
  exports: [OnboardingService],
})
export class OnboardingModule {}
