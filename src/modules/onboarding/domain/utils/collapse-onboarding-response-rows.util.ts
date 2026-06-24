import type { UserOnboardingResponseEntity } from '../entities/user-onboarding-response.entity';
import type { OnboardingResponseRow } from '../interfaces/onboarding-response-row.interface';

export function collapseRowsToResponses(
  rows: readonly OnboardingResponseRow[],
): UserOnboardingResponseEntity[] {
  const byQuestion = new Map<string, { optionIds: string[]; customValue: string | null }>();

  for (const row of rows) {
    const entry = byQuestion.get(row.questionId) ?? { optionIds: [], customValue: null };
    byQuestion.set(row.questionId, entry);

    if (row.optionId !== null) {
      entry.optionIds.push(row.optionId);
    }

    if (row.customValue !== null) {
      entry.customValue = row.customValue;
    }
  }

  return Array.from(byQuestion.entries()).map(([questionId, { optionIds, customValue }]) => ({
    questionId,
    optionIds,
    customValue,
  }));
}
