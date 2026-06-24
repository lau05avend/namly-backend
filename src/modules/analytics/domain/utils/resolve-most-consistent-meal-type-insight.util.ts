import type { RhythmInsightEntity } from '../entities/rhythm-insight.entity';
import type { RhythmMealLogHabitRecord } from '../interfaces/rhythm-meal-log-habit-record.interface';
import { buildMealTypeInsightMessage, resolveMealTypeInsightIcon } from './meal-type-insight.util';

export function resolveMostConsistentMealTypeInsight(
  records: readonly RhythmMealLogHabitRecord[],
): RhythmInsightEntity | null {
  const counts = new Map<string, number>();

  for (const record of records) {
    const mealTypeName = record.mealTypeName?.trim();

    if (!mealTypeName) {
      continue;
    }

    counts.set(mealTypeName, (counts.get(mealTypeName) ?? 0) + 1);
  }

  if (counts.size === 0) {
    return null;
  }

  const [mealTypeName, count] = [...counts.entries()].sort((left, right) => right[1] - left[1])[0];

  if (count === 0) {
    return null;
  }

  return {
    id: 'most-consistent-meal-type',
    type: 'meal_type',
    icon: resolveMealTypeInsightIcon(mealTypeName),
    tone: 'positive',
    message: buildMealTypeInsightMessage(mealTypeName),
  };
}
