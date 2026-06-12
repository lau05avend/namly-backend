import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { ProfilesService } from '@modules/profiles/application/profiles.service';
import { isOnboardingComplete } from '../domain/utils/is-onboarding-complete.util';
import { OnboardingRepository } from '../infrastructure/repositories/onboarding.repository';
import { UserOnboardingResponseRepository } from '../infrastructure/repositories/user-onboarding-response.repository';

@Injectable()
export class OnboardingCompletionService {
  constructor(
    private readonly onboardingRepository: OnboardingRepository,
    private readonly userOnboardingResponseRepository: UserOnboardingResponseRepository,
    private readonly profilesService: ProfilesService,
  ) {}

  async syncCompletionStatus(tx: Prisma.TransactionClient, profileId: string): Promise<void> {
    const [activeQuestionsCount, answeredQuestionsCount] = await Promise.all([
      this.onboardingRepository.countActiveQuestions(tx),
      this.userOnboardingResponseRepository.countDistinctAnsweredActiveQuestions(tx, profileId),
    ]);

    const hasCompletedOnboarding = isOnboardingComplete(
      activeQuestionsCount,
      answeredQuestionsCount,
    );

    await this.profilesService.updateOnboardingCompletionStatus(
      tx,
      profileId,
      hasCompletedOnboarding,
    );
  }
}
