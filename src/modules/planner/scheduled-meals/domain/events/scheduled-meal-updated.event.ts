export const SCHEDULED_MEAL_UPDATED_EVENT = 'scheduled-meal.updated' as const;

export class ScheduledMealUpdatedEvent {
  constructor(
    public readonly profileId: string,
    public readonly scheduledMealId: string,
    public readonly entryDate: string,
    public readonly previousEntryDate?: string,
  ) {}
}
