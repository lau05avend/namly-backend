import type { RecipeInteractionEntity } from './recipe-interaction.entity';
import type { RecipeIngredientEntity } from './recipe-ingredient.entity';
import type { RecipeStepEntity } from './recipe-step.entity';
import type { RecipeSummaryEntity } from './recipe-summary.entity';
import type { RecipeTagEntity } from './recipe-tag.entity';

export interface RecipeDetailEntity {
  readonly recipe: RecipeSummaryEntity;
  readonly ingredients: readonly RecipeIngredientEntity[];
  readonly steps: readonly RecipeStepEntity[];
  readonly tags: readonly RecipeTagEntity[];
  readonly interaction: RecipeInteractionEntity;
  readonly canEdit: boolean;
  readonly canDelete: boolean;
}
