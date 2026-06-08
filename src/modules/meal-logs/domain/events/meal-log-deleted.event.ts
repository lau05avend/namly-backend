export const MEAL_LOG_DELETED_EVENT = 'meal-log.deleted' as const;

export class MealLogDeletedEvent {
  constructor(
    public readonly profileId: string,
    public readonly mealLogId: string,
    public readonly entryDate: string,
  ) {}
}
