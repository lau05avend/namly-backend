import type { OnboardingQuestionResponseInput } from '../interfaces/onboarding-question-response-input.interface';

function normalizeCustomValue(customValue: string | undefined): string | null {
  const trimmed = customValue?.trim() ?? null;

  return trimmed && trimmed.length > 0 ? trimmed : null;
}

export function normalizeOnboardingResponseInput(
  questionId: string,
  optionIds: string[] | undefined,
  customValue: string | undefined,
): OnboardingQuestionResponseInput {
  return {
    questionId,
    optionIds: optionIds ?? [],
    customValue: normalizeCustomValue(customValue),
  };
}
