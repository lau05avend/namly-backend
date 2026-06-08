export const SCHEDULED_MEAL_DELETED_EVENT = 'scheduled-meal.deleted' as const;

export class ScheduledMealDeletedEvent {
  constructor(
    public readonly profileId: string,
    public readonly scheduledMealId: string,
    public readonly entryDate: string,
  ) {}
}
