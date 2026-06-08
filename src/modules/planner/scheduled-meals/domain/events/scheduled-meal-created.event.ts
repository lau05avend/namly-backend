export const SCHEDULED_MEAL_CREATED_EVENT = 'scheduled-meal.created' as const;

export class ScheduledMealCreatedEvent {
  constructor(
    public readonly profileId: string,
    public readonly scheduledMealId: string,
    public readonly entryDate: string,
  ) {}
}
