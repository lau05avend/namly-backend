export interface HomeRegisteredMealEntity {
  readonly id: string;
  readonly mealTypeName: string;
  readonly loggedAt: Date;
  readonly detail: string | null;
  readonly mediaUrl: string | null;
}
