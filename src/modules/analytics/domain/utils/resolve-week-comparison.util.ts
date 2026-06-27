import { RHYTHM_COMPARISON_MIN_ACTIVE_DAYS } from '../constants/rhythm.constants';
import type { RhythmWeekComparisonEntity } from '../entities/rhythm-week-comparison.entity';
import type { RhythmDailyActivityRecord } from '../interfaces/rhythm-daily-activity-record.interface';
import { resolveWeekAverageCompletion } from './resolve-week-average-completion.util';

export function resolveWeekComparison(
  currentWeekActivities: readonly RhythmDailyActivityRecord[],
  previousWeekActivities: readonly RhythmDailyActivityRecord[],
): RhythmWeekComparisonEntity {
  const previousActiveDays = previousWeekActivities.filter(
    (activity) => activity.countsForStreak,
  ).length;

  if (previousActiveDays < RHYTHM_COMPARISON_MIN_ACTIVE_DAYS) {
    return {
      deltaPercentage: 0,
      message: '',
    };
  }

  const currentAverage = resolveWeekAverageCompletion(currentWeekActivities);
  const previousAverage = resolveWeekAverageCompletion(previousWeekActivities);
  const deltaPercentage = Math.round(currentAverage - previousAverage);

  if (deltaPercentage > 0) {
    return {
      deltaPercentage,
      message: 'Más actividad que la semana pasada',
    };
  }

  if (deltaPercentage < 0) {
    return {
      deltaPercentage,
      message: 'Menos actividad que la semana pasada',
    };
  }

  return {
    deltaPercentage: 0,
    message: 'Actividad similar a la semana pasada',
  };
}
