import type { ScheduledMealMealTypeEntity } from './scheduled-meal-meal-type.entity';
import type { ScheduledMealRecipeEntity } from './scheduled-meal-recipe.entity';

export interface ScheduledMealSuggestionEntity {
  readonly id: string;
  readonly plannedTime: string;
  readonly mealType: ScheduledMealMealTypeEntity;
  readonly recipes: readonly ScheduledMealRecipeEntity[];
  readonly isExpress: boolean;
  readonly expressNote: string | null;
}
