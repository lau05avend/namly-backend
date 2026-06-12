import type { UserOnboardingResponseEntity } from '../../domain/entities/user-onboarding-response.entity';
import type { OnboardingQuestionResponseInput } from '../../domain/interfaces/onboarding-question-response-input.interface';
import { normalizeOnboardingResponseInput } from '../../domain/utils/normalize-onboarding-response.util';
import type { OnboardingResponseItemDto } from '../dto/onboarding-response-item.dto';
import { OnboardingResponseDto } from '../dto/onboarding-response.dto';

export class OnboardingResponsesMapper {
  static toInputList(
    items: readonly OnboardingResponseItemDto[],
  ): OnboardingQuestionResponseInput[] {
    return items.map((item) =>
      normalizeOnboardingResponseInput(item.questionId, item.optionIds, item.customValue),
    );
  }

  static toDtoList(responses: readonly UserOnboardingResponseEntity[]): OnboardingResponseDto[] {
    return responses.map((response) => this.toDto(response));
  }

  private static toDto(response: UserOnboardingResponseEntity): OnboardingResponseDto {
    const dto = new OnboardingResponseDto();

    dto.questionId = response.questionId;
    dto.optionIds = response.optionIds;
    dto.customValue = response.customValue;

    return dto;
  }
}
