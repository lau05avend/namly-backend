import { Injectable } from '@nestjs/common';
import { UserFoodPreferencesService } from '@modules/onboarding/application/user-food-preferences.service';
import type { RecipeCompatibilityEntity } from '../domain/entities/recipe-compatibility.entity';
import type { RecipeIngredientEntity } from '../domain/entities/recipe-ingredient.entity';
import type { RecipeTagEntity } from '../domain/entities/recipe-tag.entity';
import {
  evaluateRecipeCompatibility,
  hasCompatibilityWarning,
} from '@shared/food-preferences/evaluate-recipe-compatibility.util';

export type RecipeCompatibilitySource = {
  ingredients: readonly RecipeIngredientEntity[];
  tags: readonly RecipeTagEntity[];
};

@Injectable()
export class RecipeCompatibilityService {
  constructor(private readonly userFoodPreferencesService: UserFoodPreferencesService) {}

  async evaluateForProfile(
    profileId: string,
    recipe: RecipeCompatibilitySource,
  ): Promise<RecipeCompatibilityEntity> {
    const restrictions = await this.userFoodPreferencesService.resolveForProfile(profileId);

    const hasAnyRestriction =
      restrictions.avoidAllergenGroups.length > 0 ||
      restrictions.dietTagIds.length > 0 ||
      restrictions.customAvoidTerms.length > 0;

    if (!hasAnyRestriction) {
      return {
        hasCompatibilityWarning: false,
        conflicts: [],
        flaggedIngredientIds: [],
      };
    }

    const result = evaluateRecipeCompatibility(
      {
        ingredients: recipe.ingredients.map((ingredient) => ({
          id: ingredient.id,
          name: ingredient.name,
        })),
        tagIds: recipe.tags.map((tag) => tag.id),
      },
      restrictions,
    );

    return {
      hasCompatibilityWarning: hasCompatibilityWarning(result.conflicts),
      conflicts: result.conflicts,
      flaggedIngredientIds: result.flaggedIngredientIds,
    };
  }
}
