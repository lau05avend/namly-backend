import type { OnboardingOptionEntity } from './onboarding-option.entity';

export interface OnboardingQuestionEntity {
  readonly id: string;
  readonly questionText: string;
  readonly inputType: string;
  readonly allowCustomInput: boolean;
  readonly allowMultiple: boolean;
  readonly maxSelections: number | null;
  readonly sortOrder: number;
  readonly options: readonly OnboardingOptionEntity[];
}
