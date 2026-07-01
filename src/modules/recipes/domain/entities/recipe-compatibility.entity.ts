import type { RecipeCompatibilityConflictEntity } from '@shared/food-preferences/evaluate-recipe-compatibility.util';

export type RecipeCompatibilityEntity = {
  hasCompatibilityWarning: boolean;
  conflicts: readonly RecipeCompatibilityConflictEntity[];
  flaggedIngredientIds: readonly string[];
};
