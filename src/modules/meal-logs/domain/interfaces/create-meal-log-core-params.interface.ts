export interface CreateMealLogCoreParams {
  readonly scheduledMealId: string | null;
  readonly mealTypeId: string | null;
  readonly mediaUrl: string;
  readonly content: string | null;
  readonly score: number | null;
  readonly loggedAt: Date;
}
