export const SCHEDULED_MEAL_STATUSES = ['completed', 'next', 'upcoming', 'missed'] as const;

export type ScheduledMealStatus = (typeof SCHEDULED_MEAL_STATUSES)[number];
