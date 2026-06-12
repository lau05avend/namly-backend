import type { OnboardingQuestionResponseInput } from '../interfaces/onboarding-question-response-input.interface';
import type { OnboardingResponseRow } from '../interfaces/onboarding-response-row.interface';

export function expandResponseToRows(
  response: OnboardingQuestionResponseInput,
): OnboardingResponseRow[] {
  const rows: OnboardingResponseRow[] = response.optionIds.map((optionId) => ({
    questionId: response.questionId,
    optionId,
    customValue: null,
  }));

  if (response.customValue !== null) {
    rows.push({
      questionId: response.questionId,
      optionId: null,
      customValue: response.customValue,
    });
  }

  return rows;
}

export function expandResponsesToRows(
  responses: readonly OnboardingQuestionResponseInput[],
): OnboardingResponseRow[] {
  return responses.flatMap((response) => expandResponseToRows(response));
}
