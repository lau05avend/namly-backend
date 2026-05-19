import type { UpdateRecipeIngredientParams } from './update-recipe-ingredient-params.interface';
import type { UpdateRecipeStepParams } from './update-recipe-step-params.interface';

export interface UpdateRecipeParams {
  title?: string;
  description?: string | null;
  coverUrl?: string | null;
  isPublic?: boolean;
  ingredients?: readonly UpdateRecipeIngredientParams[];
  steps?: readonly UpdateRecipeStepParams[];
  tagIds?: readonly string[];
}
