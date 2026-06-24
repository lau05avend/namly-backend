import {
  EMPTY_TIME_SLOT_DISTRIBUTION,
  TIME_SLOT_INSIGHT_MESSAGES,
  type TimeSlot,
  type TimeSlotDistribution,
} from '../constants/time-slot.constants';
import type { RhythmInsightEntity } from '../entities/rhythm-insight.entity';
import type { RhythmMealLogHabitRecord } from '../interfaces/rhythm-meal-log-habit-record.interface';
import { resolveTimeSlotFromHour } from './resolve-time-slot.util';

export function resolveTimeSlotDistribution(
  records: readonly RhythmMealLogHabitRecord[],
): TimeSlotDistribution {
  const distribution: TimeSlotDistribution = { ...EMPTY_TIME_SLOT_DISTRIBUTION };

  for (const record of records) {
    const slot = resolveTimeSlotFromHour(record.loggedAt.getHours());
    distribution[slot] += 1;
  }

  return distribution;
}

export function resolvePreferredTimeSlotInsight(
  distribution: TimeSlotDistribution,
): RhythmInsightEntity | null {
  const entries = (Object.entries(distribution) as Array<[TimeSlot, number]>).sort(
    (left, right) => right[1] - left[1],
  );

  const [slot, count] = entries[0] ?? ['morning', 0];

  if (count === 0) {
    return null;
  }

  return {
    id: 'preferred-time-slot',
    type: 'time_slot',
    icon: 'clock',
    tone: 'neutral',
    message: TIME_SLOT_INSIGHT_MESSAGES[slot],
  };
}
