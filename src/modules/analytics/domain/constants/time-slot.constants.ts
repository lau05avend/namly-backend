export const TIME_SLOTS = ['morning', 'midday', 'afternoon', 'night'] as const;

export type TimeSlot = (typeof TIME_SLOTS)[number];

export type TimeSlotDistribution = Record<TimeSlot, number>;

export const EMPTY_TIME_SLOT_DISTRIBUTION: TimeSlotDistribution = {
  morning: 0,
  midday: 0,
  afternoon: 0,
  night: 0,
};

export const TIME_SLOT_INSIGHT_MESSAGES: Record<TimeSlot, string> = {
  morning: 'La mayoría de tus registros ocurren por la mañana',
  midday: 'La mayoría de tus registros ocurren entre 12 y 2 p. m.',
  afternoon: 'La mayoría de tus registros ocurren por la tarde',
  night: 'La mayoría de tus registros ocurren por la noche',
};
