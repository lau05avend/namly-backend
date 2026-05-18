import { Injectable } from '@nestjs/common';
import type { OnboardingQuestionEntity } from '../domain/entities/onboarding-question.entity';
import { OnboardingRepository } from '../infrastructure/repositories/onboarding.repository';

@Injectable()
export class OnboardingService {
  constructor(private readonly onboardingRepository: OnboardingRepository) {}

  async getQuestions(): Promise<OnboardingQuestionEntity[]> {
    return this.onboardingRepository.findActiveQuestionsWithOptions();
  }
}
