import { Module } from '@nestjs/common';
import { ProfilesModule } from '@modules/profiles/profiles.module';
import { OnboardingCompletionService } from './application/onboarding-completion.service';
import { OnboardingResponsesService } from './application/onboarding-responses.service';
import { OnboardingResponsesValidationService } from './application/onboarding-responses-validation.service';
import { OnboardingService } from './application/onboarding.service';
import { CompleteOnboardingResponsesUseCase } from './application/use-cases/complete-onboarding-responses.use-case';
import { UpdateOnboardingResponsesUseCase } from './application/use-cases/update-onboarding-responses.use-case';
import { OnboardingRepository } from './infrastructure/repositories/onboarding.repository';
import { UserOnboardingResponseRepository } from './infrastructure/repositories/user-onboarding-response.repository';
import { OnboardingController } from './presentation/controllers/onboarding.controller';

@Module({
  imports: [ProfilesModule],
  controllers: [OnboardingController],
  providers: [
    OnboardingService,
    OnboardingResponsesService,
    OnboardingCompletionService,
    OnboardingResponsesValidationService,
    CompleteOnboardingResponsesUseCase,
    UpdateOnboardingResponsesUseCase,
    OnboardingRepository,
    UserOnboardingResponseRepository,
  ],
})
export class OnboardingModule {}
