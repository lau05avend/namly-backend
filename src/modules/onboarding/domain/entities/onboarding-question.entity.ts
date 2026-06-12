import type { OnboardingOptionsLayout } from '../constants/onboarding-options-layout.constants';
import type { OnboardingOptionEntity } from './onboarding-option.entity';

export interface OnboardingQuestionEntity {
  readonly id: string;
  readonly questionText: string;
  readonly inputType: string;
  readonly allowCustomInput: boolean;
  readonly allowMultiple: boolean;
  readonly maxSelections: number | null;
  readonly sortOrder: number;
  readonly questionIconName: string;
  readonly optionsLayout: OnboardingOptionsLayout;
  readonly options: readonly OnboardingOptionEntity[];
}
