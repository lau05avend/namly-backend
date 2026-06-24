import type { RhythmInsightEntity } from '../entities/rhythm-insight.entity';
import type { RhythmMealLogHabitRecord } from '../interfaces/rhythm-meal-log-habit-record.interface';

const TAG_PATTERN_INSIGHTS: Record<
  string,
  Pick<RhythmInsightEntity, 'id' | 'icon' | 'tone' | 'message'>
> = {
  Casero: {
    id: 'homemade-pattern',
    icon: 'chef-hat',
    tone: 'positive',
    message: 'Predominaron recetas caseras esta semana',
  },
  Restaurante: {
    id: 'eating-out-pattern',
    icon: 'utensils',
    tone: 'neutral',
    message: 'Comiste más fuera de casa esta semana',
  },
  Saludable: {
    id: 'healthy-pattern',
    icon: 'leaf',
    tone: 'positive',
    message: 'Tus comidas estuvieron más orientadas a lo saludable',
  },
};

function countDistinctTags(records: readonly RhythmMealLogHabitRecord[]): number {
  const tagNames = new Set<string>();

  for (const record of records) {
    for (const tagName of record.tagNames) {
      const normalized = tagName.trim();

      if (normalized.length > 0) {
        tagNames.add(normalized);
      }
    }
  }

  return tagNames.size;
}

function resolveTopTagName(records: readonly RhythmMealLogHabitRecord[]): string | null {
  const counts = new Map<string, number>();

  for (const record of records) {
    for (const tagName of record.tagNames) {
      const normalized = tagName.trim();

      if (!normalized) {
        continue;
      }

      counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    }
  }

  if (counts.size === 0) {
    return null;
  }

  return [...counts.entries()].sort((left, right) => right[1] - left[1])[0][0];
}

export function resolveTagPatternInsights(
  currentWeekRecords: readonly RhythmMealLogHabitRecord[],
  previousWeekRecords: readonly RhythmMealLogHabitRecord[],
): RhythmInsightEntity[] {
  const insights: RhythmInsightEntity[] = [];
  const topTagName = resolveTopTagName(currentWeekRecords);

  if (topTagName) {
    const mappedInsight = TAG_PATTERN_INSIGHTS[topTagName];

    if (mappedInsight) {
      insights.push({
        ...mappedInsight,
        type: 'tag_pattern',
      });
    }
  }

  const currentDistinctTags = countDistinctTags(currentWeekRecords);
  const previousDistinctTags = countDistinctTags(previousWeekRecords);

  if (currentDistinctTags > previousDistinctTags && currentDistinctTags >= 2) {
    insights.push({
      id: 'variety-pattern',
      type: 'tag_pattern',
      icon: 'sprout',
      tone: 'positive',
      message: 'Tus comidas fueron más variadas que la semana pasada',
    });
  }

  return insights;
}
