import type { OnboardingOptionEntity } from '../../domain/entities/onboarding-option.entity';
import type { OnboardingQuestionEntity } from '../../domain/entities/onboarding-question.entity';
import { OnboardingOptionDto } from '../dto/onboarding-option.dto';
import { OnboardingQuestionDto } from '../dto/onboarding-question.dto';

export class OnboardingQuestionsMapper {
  static toDtoList(questions: readonly OnboardingQuestionEntity[]): OnboardingQuestionDto[] {
    return questions.map((question) => this.toDto(question));
  }

  private static toDto(question: OnboardingQuestionEntity): OnboardingQuestionDto {
    const dto = new OnboardingQuestionDto();

    dto.id = question.id;
    dto.questionText = question.questionText;
    dto.inputType = question.inputType;
    dto.allowCustomInput = question.allowCustomInput;
    dto.allowMultiple = question.allowMultiple;
    dto.maxSelections = question.maxSelections;
    dto.sortOrder = question.sortOrder;
    dto.options = question.options.map((option) => this.toOptionDto(option));

    return dto;
  }

  private static toOptionDto(option: OnboardingOptionEntity): OnboardingOptionDto {
    const dto = new OnboardingOptionDto();

    dto.id = option.id;
    dto.label = option.label;
    dto.iconName = option.iconName;
    dto.isDefault = option.isDefault;
    dto.sortOrder = option.sortOrder;

    return dto;
  }
}
