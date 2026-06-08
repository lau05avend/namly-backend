export const MEAL_LOG_UPDATED_EVENT = 'meal-log.updated' as const;

export class MealLogUpdatedEvent {
  constructor(
    public readonly profileId: string,
    public readonly mealLogId: string,
    public readonly entryDate: string,
    public readonly previousEntryDate?: string,
  ) {}
}
