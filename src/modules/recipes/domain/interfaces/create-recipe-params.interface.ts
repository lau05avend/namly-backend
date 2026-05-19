import type { CreateRecipeIngredientParams } from './create-recipe-ingredient-params.interface';
import type { CreateRecipeStepParams } from './create-recipe-step-params.interface';

export interface CreateRecipeParams {
  title: string;
  description?: string | null;
  coverUrl?: string | null;
  isPublic?: boolean;
  ingredients: readonly CreateRecipeIngredientParams[];
  steps: readonly CreateRecipeStepParams[];
  tagIds: readonly string[];
}
