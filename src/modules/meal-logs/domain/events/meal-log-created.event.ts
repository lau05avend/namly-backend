export const MEAL_LOG_CREATED_EVENT = 'meal-log.created' as const;

export class MealLogCreatedEvent {
  constructor(
    public readonly profileId: string,
    public readonly mealLogId: string,
    public readonly loggedAt: Date,
  ) {}
}
