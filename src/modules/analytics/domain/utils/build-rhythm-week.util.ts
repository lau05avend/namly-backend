import { RHYTHM_WEEK_TOTAL_DAYS } from '../constants/rhythm.constants';
import type { RhythmWeekEntity } from '../entities/rhythm-week.entity';
import type { RhythmDailyActivityRecord } from '../interfaces/rhythm-daily-activity-record.interface';
import { getWeekDayDates } from './entry-date-range.util';
import { resolveDayIntensity } from './resolve-day-intensity.util';
import { resolveWeekAverageCompletion } from './resolve-week-average-completion.util';
import { resolveWeekComparison } from './resolve-week-comparison.util';
import { resolveWeekSummary } from './resolve-week-summary.util';

export function buildRhythmWeekEntity(params: {
  weekStart: string;
  weekEnd: string;
  today: string;
  currentWeekActivities: readonly RhythmDailyActivityRecord[];
  previousWeekActivities: readonly RhythmDailyActivityRecord[];
}): RhythmWeekEntity {
  const activityByDate = new Map(
    params.currentWeekActivities.map((activity) => [activity.entryDate, activity]),
  );

  const activeDays = params.currentWeekActivities.filter(
    (activity) => activity.countsForStreak,
  ).length;

  const averageCompletion = resolveWeekAverageCompletion(params.currentWeekActivities);

  return {
    weekStart: params.weekStart,
    weekEnd: params.weekEnd,
    summary: resolveWeekSummary(averageCompletion),
    activeDays,
    totalDays: RHYTHM_WEEK_TOTAL_DAYS,
    averageCompletion,
    comparison: resolveWeekComparison(
      params.currentWeekActivities,
      params.previousWeekActivities,
    ),
    days: getWeekDayDates(params.weekStart).map((date) => ({
      date,
      intensity: resolveDayIntensity(activityByDate.get(date) ?? null),
      isToday: date === params.today,
    })),
  };
}
