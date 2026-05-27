import type { MealLogMealTypeEntity } from './meal-log-meal-type.entity';
import type { MealLogRecipeEntity } from './meal-log-recipe.entity';
import type { MealLogScheduledMealEntity } from './meal-log-scheduled-meal.entity';
import type { MealLogTagEntity } from './meal-log-tag.entity';

export interface MealLogDetailEntity {
  readonly id: string;
  readonly mediaUrl: string;
  readonly content: string | null;
  readonly score: number | null;
  readonly loggedAt: Date;
  readonly mealType: MealLogMealTypeEntity | null;
  readonly scheduledMeal: MealLogScheduledMealEntity | null;
  readonly recipes: readonly MealLogRecipeEntity[];
  readonly tags: readonly MealLogTagEntity[];
}
