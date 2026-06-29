import type { MealLogMealTypeEntity } from './meal-log-meal-type.entity';
import type { MealLogRecipeEntity } from './meal-log-recipe.entity';

export interface MealLogScheduledMealEntity {
  readonly id: string;
  readonly entryDate: string;
  readonly plannedTime: string;
  readonly isExpress: boolean;
  readonly expressNote: string | null;
  readonly mealType: MealLogMealTypeEntity;
  readonly recipes: readonly MealLogRecipeEntity[];
  readonly totalDurationMinutes: number | null;
}
