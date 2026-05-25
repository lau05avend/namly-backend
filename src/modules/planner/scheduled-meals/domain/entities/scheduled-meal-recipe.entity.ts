export interface ScheduledMealRecipeEntity {
  readonly id: string;
  readonly recipeId: string;
  readonly title: string;
  readonly coverUrl: string | null;
  readonly sortOrder: number;
}
