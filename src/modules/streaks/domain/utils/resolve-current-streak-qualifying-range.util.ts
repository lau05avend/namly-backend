import type { StreakStateParams } from '../interfaces/upsert-streak-params.interface';
import type { StreakAffectedDateCategory } from './streak-affected-date-category.util';

export type QualifyingDateRange = {
  startDate: string;
  endDate: string;
};

/**
 * Bounds the activity query for current-streak recomputation.
 * Returns `full_history` when the active tail cannot be derived from streak bounds alone.
 */
export function resolveCurrentStreakQualifyingDateRange(
  affectedDate: string,
  category: StreakAffectedDateCategory,
  existing: StreakStateParams | null,
): QualifyingDateRange | 'full_history' {
  if (category === 'historical_before_active_chain') {
    return 'full_history';
  }

  if (category === 'no_active_chain') {
    return { startDate: affectedDate, endDate: affectedDate };
  }

  if (!existing?.currentStreakStartDate || !existing.lastActiveDate) {
    return { startDate: affectedDate, endDate: affectedDate };
  }

  switch (category) {
    case 'extends_active_chain':
      return {
        startDate: affectedDate,
        endDate: existing.lastActiveDate,
      };
    case 'inside_active_chain':
      return {
        startDate: existing.currentStreakStartDate,
        endDate: existing.lastActiveDate,
      };
    case 'newer_than_active_chain':
      return {
        startDate: existing.currentStreakStartDate,
        endDate: affectedDate,
      };
    default:
      return 'full_history';
  }
}
