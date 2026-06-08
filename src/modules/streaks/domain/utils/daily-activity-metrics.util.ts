import { MIN_MEALS_FOR_STREAK } from '../constants/streak.constants';

export function computeCompletionPercentage(
  mealsPlanned: number,
  mealsRegistered: number,
): number | null {
  if (mealsPlanned === 0) {
    return null;
  }

  return Math.min(100, (mealsRegistered / mealsPlanned) * 100);
}

/** Streak eligibility is independent of planner; based on meal logs only. */
export function computeCountsForStreak(mealsRegistered: number): boolean {
  return mealsRegistered >= MIN_MEALS_FOR_STREAK;
}
