export interface CreateScheduledMealParams {
  mealTypeId: string;
  entryDate: string;
  plannedTime: string;
  isExpress: boolean;
  expressNote?: string | null;
  recipeIds?: readonly string[];
}
