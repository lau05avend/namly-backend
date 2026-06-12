import { BadRequestException, Injectable } from '@nestjs/common';
import type { OnboardingQuestionResponseInput } from '../domain/interfaces/onboarding-question-response-input.interface';
import { OnboardingRepository } from '../infrastructure/repositories/onboarding.repository';

@Injectable()
export class OnboardingResponsesValidationService {
  constructor(private readonly onboardingRepository: OnboardingRepository) {}

  async validateResponses(responses: readonly OnboardingQuestionResponseInput[]): Promise<void> {
    if (responses.length === 0) {
      return;
    }

    this.assertUniqueQuestionIds(responses);
    this.assertUniqueOptionIdsPerResponse(responses);
    this.assertEachResponseHasValue(responses);

    const questionIds = responses.map((response) => response.questionId);
    const existingQuestionCount =
      await this.onboardingRepository.countExistingQuestionsByIds(questionIds);

    if (existingQuestionCount !== new Set(questionIds).size) {
      throw new BadRequestException('One or more questions do not exist');
    }

    const optionPairs = responses.flatMap((response) =>
      response.optionIds.map((optionId) => ({
        questionId: response.questionId,
        optionId,
      })),
    );

    if (optionPairs.length > 0) {
      const validOptionCount =
        await this.onboardingRepository.countValidOptionQuestionPairs(optionPairs);

      if (validOptionCount !== optionPairs.length) {
        throw new BadRequestException('One or more options do not belong to their question');
      }
    }

    const customInputFlags =
      await this.onboardingRepository.findQuestionsCustomInputFlags(questionIds);

    for (const response of responses) {
      if (response.customValue !== null && !customInputFlags.get(response.questionId)) {
        throw new BadRequestException(
          `Question ${response.questionId} does not allow custom input`,
        );
      }
    }
  }

  private assertUniqueQuestionIds(responses: readonly OnboardingQuestionResponseInput[]): void {
    const questionIds = responses.map((response) => response.questionId);

    if (new Set(questionIds).size !== questionIds.length) {
      throw new BadRequestException('Duplicate question IDs in request');
    }
  }

  private assertUniqueOptionIdsPerResponse(
    responses: readonly OnboardingQuestionResponseInput[],
  ): void {
    for (const response of responses) {
      if (new Set(response.optionIds).size !== response.optionIds.length) {
        throw new BadRequestException(
          `Duplicate option IDs in response for question ${response.questionId}`,
        );
      }
    }
  }

  private assertEachResponseHasValue(responses: readonly OnboardingQuestionResponseInput[]): void {
    for (const response of responses) {
      if (response.optionIds.length === 0 && response.customValue === null) {
        throw new BadRequestException(
          `Response for question ${response.questionId} must include optionIds or customValue`,
        );
      }
    }
  }
}
