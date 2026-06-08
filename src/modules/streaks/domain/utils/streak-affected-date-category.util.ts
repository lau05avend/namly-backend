import type { StreakStateParams } from '../interfaces/upsert-streak-params.interface';
import { previousDay } from './calendar-day.util';

export type StreakAffectedDateCategory =
  | 'inside_active_chain'
  | 'extends_active_chain'
  | 'newer_than_active_chain'
  | 'historical_before_active_chain'
  | 'no_active_chain';

export function classifyAffectedDateCategory(
  affectedDate: string,
  existing: StreakStateParams | null,
): StreakAffectedDateCategory {
  if (
    !existing?.lastActiveDate ||
    !existing.currentStreakStartDate ||
    existing.currentStreak === 0
  ) {
    return 'no_active_chain';
  }

  const { lastActiveDate, currentStreakStartDate } = existing;

  if (affectedDate >= currentStreakStartDate && affectedDate <= lastActiveDate) {
    return 'inside_active_chain';
  }

  if (affectedDate === previousDay(currentStreakStartDate)) {
    return 'extends_active_chain';
  }

  if (affectedDate > lastActiveDate) {
    return 'newer_than_active_chain';
  }

  if (affectedDate < previousDay(currentStreakStartDate)) {
    return 'historical_before_active_chain';
  }

  return 'historical_before_active_chain';
}

export function affectsCurrentStreak(category: StreakAffectedDateCategory): boolean {
  return category !== 'historical_before_active_chain';
}

/** Full history scan — only when a historical chain may change longest. */
export function requiresLongestStreakRecalculation(category: StreakAffectedDateCategory): boolean {
  return category === 'historical_before_active_chain' || category === 'no_active_chain';
}

/** On create: bump longest when the new current streak exceeds the stored record. */
export function shouldPromoteLongestFromCurrent(category: StreakAffectedDateCategory): boolean {
  return affectsCurrentStreak(category);
}
