import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { ProfilesService } from '@modules/profiles/application/profiles.service';
import type { UserOnboardingResponseEntity } from '../../domain/entities/user-onboarding-response.entity';
import type { OnboardingQuestionResponseInput } from '../../domain/interfaces/onboarding-question-response-input.interface';
import { UserOnboardingResponseRepository } from '../../infrastructure/repositories/user-onboarding-response.repository';
import { OnboardingCompletionService } from '../onboarding-completion.service';
import { OnboardingResponsesService } from '../onboarding-responses.service';
import { OnboardingResponsesValidationService } from '../onboarding-responses-validation.service';

@Injectable()
export class UpdateOnboardingResponsesUseCase {
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

    await this.onboardingResponsesValidationService.validateResponses(responses);

    await this.prisma.$transaction(async (tx) => {
      await this.userOnboardingResponseRepository.replaceQuestionsInTransaction(
        tx,
        profileId,
        responses,
      );
      await this.onboardingCompletionService.syncCompletionStatus(tx, profileId);
    });

    return this.onboardingResponsesService.getResponses(profileId);
  }
}
