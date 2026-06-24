import type { RhythmDailyActivityRecord } from '../interfaces/rhythm-daily-activity-record.interface';

export function resolveWeekAverageCompletion(
  activities: readonly RhythmDailyActivityRecord[],
): number {
  const plannedDays = activities.filter((activity) => activity.mealsPlanned > 0);

  if (plannedDays.length === 0) {
    return 0;
  }

  const totalCompletion = plannedDays.reduce((total, activity) => {
    return total + (activity.completionPercentage ?? 0);
  }, 0);

  return Math.round(totalCompletion / plannedDays.length);
}
