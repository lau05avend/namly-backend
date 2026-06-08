import type { StreakStateParams } from '../interfaces/upsert-streak-params.interface';
import { isConsecutiveDay, previousDay } from './calendar-day.util';

export type CurrentStreakResult = Pick<
  StreakStateParams,
  'currentStreak' | 'lastActiveDate' | 'currentStreakStartDate'
>;

const EMPTY_CURRENT_STREAK: CurrentStreakResult = {
  currentStreak: 0,
  lastActiveDate: null,
  currentStreakStartDate: null,
};

export function computeCurrentStreakFromQualifyingDates(
  qualifyingDates: readonly string[],
): CurrentStreakResult {
  if (qualifyingDates.length === 0) {
    return EMPTY_CURRENT_STREAK;
  }

  const sortedDates = [...qualifyingDates].sort();
  const qualifyingSet = new Set(sortedDates);
  const lastActiveDate = sortedDates[sortedDates.length - 1] ?? null;

  let currentStreak = 0;
  let currentStreakStartDate: string | null = null;
  let cursor = lastActiveDate;

  while (qualifyingSet.has(cursor)) {
    currentStreakStartDate = cursor;
    currentStreak += 1;
    cursor = previousDay(cursor);
  }

  return {
    currentStreak,
    lastActiveDate,
    currentStreakStartDate,
  };
}

export function computeLongestStreakFromQualifyingDates(
  qualifyingDates: readonly string[],
): number {
  if (qualifyingDates.length === 0) {
    return 0;
  }

  const sortedDates = [...qualifyingDates].sort();
  let longestStreak = 1;
  let runLength = 1;

  for (let index = 1; index < sortedDates.length; index += 1) {
    const previousDate = sortedDates[index - 1];
    const currentDate = sortedDates[index];

    if (previousDate !== undefined && isConsecutiveDay(previousDate, currentDate)) {
      runLength += 1;
    } else {
      longestStreak = Math.max(longestStreak, runLength);
      runLength = 1;
    }
  }

  return Math.max(longestStreak, runLength);
}

export function computeStreakStateFromQualifyingDates(
  qualifyingDates: readonly string[],
): StreakStateParams {
  const current = computeCurrentStreakFromQualifyingDates(qualifyingDates);
  const longestStreak = computeLongestStreakFromQualifyingDates(qualifyingDates);

  return {
    ...current,
    longestStreak,
  };
}

/** On create flows: longest only needs to catch up when current exceeds the stored record. */
export function promoteLongestStreakFromCurrent(
  existing: StreakStateParams | null,
  current: CurrentStreakResult,
): number {
  return Math.max(existing?.longestStreak ?? 0, current.currentStreak);
}

export function mergeStreakState(
  existing: StreakStateParams | null,
  current: CurrentStreakResult | null,
  longestStreak: number | null,
): StreakStateParams {
  return {
    currentStreak: current?.currentStreak ?? existing?.currentStreak ?? 0,
    currentStreakStartDate:
      current?.currentStreakStartDate ?? existing?.currentStreakStartDate ?? null,
    lastActiveDate: current?.lastActiveDate ?? existing?.lastActiveDate ?? null,
    longestStreak: longestStreak ?? existing?.longestStreak ?? 0,
  };
}

export function isSameStreakState(
  left: StreakStateParams | null,
  right: StreakStateParams,
): boolean {
  if (!left) {
    return false;
  }

  return (
    left.currentStreak === right.currentStreak &&
    left.longestStreak === right.longestStreak &&
    left.lastActiveDate === right.lastActiveDate &&
    left.currentStreakStartDate === right.currentStreakStartDate
  );
}
