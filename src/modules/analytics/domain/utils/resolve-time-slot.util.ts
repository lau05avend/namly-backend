import type { TimeSlot } from '../constants/time-slot.constants';

export function resolveTimeSlotFromHour(hour: number): TimeSlot {
  if (hour >= 6 && hour < 11) {
    return 'morning';
  }

  if (hour >= 11 && hour < 15) {
    return 'midday';
  }

  if (hour >= 15 && hour < 19) {
    return 'afternoon';
  }

  return 'night';
}
