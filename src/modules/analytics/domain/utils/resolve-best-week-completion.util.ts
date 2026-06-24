import { getWeekStart } from '@modules/streaks/domain/utils/week-start.util';
import type { RhythmLifetimeSourceRecord } from '../interfaces/rhythm-lifetime-source-record.interface';
import { resolveWeekAverageCompletion } from './resolve-week-average-completion.util';

export function resolveBestWeekCompletion(source: RhythmLifetimeSourceRecord): number {
  const activitiesByWeek = new Map<string, RhythmLifetimeSourceRecord['dailyActivities']>();

  for (const activity of source.dailyActivities) {
    if (activity.mealsPlanned <= 0) {
      continue;
    }

    const weekKey = activity.weekStart ?? getWeekStart(activity.entryDate);
    const existing = activitiesByWeek.get(weekKey);
    const weekActivities = existing ? [...existing, activity] : [activity];
    activitiesByWeek.set(weekKey, weekActivities);
  }

  let bestWeekCompletion = 0;

  for (const weekActivities of activitiesByWeek.values()) {
    const weekAverage = resolveWeekAverageCompletion(
      weekActivities.map((activity) => ({
        entryDate: activity.entryDate,
        weekStart: activity.weekStart,
        mealsPlanned: activity.mealsPlanned,
        mealsRegistered: 0,
        completionPercentage: activity.completionPercentage,
        countsForStreak: false,
      })),
    );

    if (weekAverage > bestWeekCompletion) {
      bestWeekCompletion = weekAverage;
    }
  }

  return bestWeekCompletion;
}
