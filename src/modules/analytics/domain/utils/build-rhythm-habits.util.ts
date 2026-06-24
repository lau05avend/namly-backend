import {
  RHYTHM_HABITS_MEAL_TYPE_WINDOW_DAYS,
  RHYTHM_HABITS_TAG_WINDOW_DAYS,
} from '../constants/rhythm.constants';
import type { RhythmHabitsEntity } from '../entities/rhythm-habits.entity';
import type { RhythmMealLogHabitRecord } from '../interfaces/rhythm-meal-log-habit-record.interface';
import { addDays } from './entry-date-range.util';
import { resolveMostConsistentMealTypeInsight } from './resolve-most-consistent-meal-type-insight.util';
import { resolveTagPatternInsights } from './resolve-tag-pattern-insights.util';
import {
  resolvePreferredTimeSlotInsight,
  resolveTimeSlotDistribution,
} from './resolve-time-slot-insights.util';

export function buildRhythmHabitsEntity(params: {
  today: string;
  mealTypeWindowRecords: readonly RhythmMealLogHabitRecord[];
  currentTagWindowRecords: readonly RhythmMealLogHabitRecord[];
  previousTagWindowRecords: readonly RhythmMealLogHabitRecord[];
}): RhythmHabitsEntity {
  const timeSlotDistribution = resolveTimeSlotDistribution(params.mealTypeWindowRecords);
  const insights = [
    resolveMostConsistentMealTypeInsight(params.mealTypeWindowRecords),
    resolvePreferredTimeSlotInsight(timeSlotDistribution),
    ...resolveTagPatternInsights(params.currentTagWindowRecords, params.previousTagWindowRecords),
  ].filter((insight): insight is NonNullable<typeof insight> => insight !== null);

  return {
    insights,
    timeSlotDistribution,
  };
}

export function resolveHabitWindowRanges(today: string): {
  mealTypeWindowStart: string;
  currentTagWindowStart: string;
  previousTagWindowStart: string;
  previousTagWindowEnd: string;
} {
  return {
    mealTypeWindowStart: addDays(today, -(RHYTHM_HABITS_MEAL_TYPE_WINDOW_DAYS - 1)),
    currentTagWindowStart: addDays(today, -(RHYTHM_HABITS_TAG_WINDOW_DAYS - 1)),
    previousTagWindowStart: addDays(today, -(RHYTHM_HABITS_TAG_WINDOW_DAYS * 2 - 1)),
    previousTagWindowEnd: addDays(today, -RHYTHM_HABITS_TAG_WINDOW_DAYS),
  };
}
