import type { RhythmDailyActivityRecord } from '../interfaces/rhythm-daily-activity-record.interface';

export function resolveDayIntensity(activity: RhythmDailyActivityRecord | null): number {
  if (!activity || activity.mealsRegistered === 0) {
    return 0;
  }

  if (activity.mealsPlanned === 0 || activity.completionPercentage === null) {
    return 2;
  }

  if (activity.completionPercentage >= 75) {
    return 3;
  }

  if (activity.completionPercentage >= 50) {
    return 2;
  }

  return 1;
}
