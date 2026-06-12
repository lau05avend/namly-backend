import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { ProfilesService } from '@modules/profiles/application/profiles.service';
import type { UserOnboardingResponseEntity } from '../../domain/entities/user-onboarding-response.entity';
import type { OnboardingQuestionResponseInput } from '../../domain/interfaces/onboarding-question-response-input.interface';
import { UserOnboardingResponseRepository } from '../../infrastructure/repositories/user-onboarding-response.repository';
import { OnboardingCompletionService } from '../onboarding-completion.service';
import { OnboardingResponsesService } from '../onboarding-responses.service';
import { OnboardingResponsesValidationService } from '../onboarding-responses-validation.service';

@Injectable()
export class CompleteOnboardingResponsesUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly profilesService: ProfilesService,
    private readonly userOnboardingResponseRepository: UserOnboardingResponseRepository,
    private readonly onboardingResponsesService: OnboardingResponsesService,
    private readonly onboardingResponsesValidationService: OnboardingResponsesValidationService,
    private readonly onboardingCompletionService: OnboardingCompletionService,
  ) {}

  async execute(
    profileId: string,
    responses: readonly OnboardingQuestionResponseInput[],
  ): Promise<UserOnboardingResponseEntity[]> {
    const onboardingStatus = await this.profilesService.getOnboardingStatus(profileId);

    if (!onboardingStatus) {
      throw new NotFoundException('Profile not found');
    }

    if (onboardingStatus.hasCompletedOnboarding) {
      throw new ConflictException('Onboarding has already been completed');
    }

    await this.onboardingResponsesValidationService.validateResponses(responses);

    const questionIds = responses.map((response) => response.questionId);
    const existingQuestionCount =
      await this.userOnboardingResponseRepository.countQuestionsWithExistingResponses(
        profileId,
        questionIds,
      );

    if (existingQuestionCount > 0) {
      throw new ConflictException('One or more questions already have responses');
    }

    await this.prisma.$transaction(async (tx) => {
      await this.userOnboardingResponseRepository.insertResponsesInTransaction(
        tx,
        profileId,
        responses,
      );
      await this.onboardingCompletionService.syncCompletionStatus(tx, profileId);
    });

    return this.onboardingResponsesService.getResponses(profileId);
  }
}
