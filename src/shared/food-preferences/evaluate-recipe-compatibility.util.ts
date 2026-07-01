import type { CompatibilityConflictType } from '@shared/food-preferences/food-preferences.constants';
import { ingredientMatchesKeyword } from '@shared/food-preferences/normalize-food-match-text.util';

export type KeywordGroup = {
  tagId: string;
  tagName: string;
  keywords: readonly string[];
};

export type RecipeCompatibilityConflictEntity = {
  type: CompatibilityConflictType;
  label: string;
  tagId: string | null;
  matchedIngredients: readonly string[];
};

export type RecipeCompatibilityInput = {
  ingredients: readonly { id: string; name: string }[];
  tagIds: readonly string[];
};

export type UserFoodRestrictionsInput = {
  avoidAllergenGroups: readonly KeywordGroup[];
  dietTagIds: readonly string[];
  dietTagNames: ReadonlyMap<string, string>;
  customAvoidTerms: readonly string[];
};

export function evaluateRecipeCompatibility(
  recipe: RecipeCompatibilityInput,
  restrictions: UserFoodRestrictionsInput,
): {
  conflicts: RecipeCompatibilityConflictEntity[];
  flaggedIngredientIds: string[];
} {
  const conflicts: RecipeCompatibilityConflictEntity[] = [];
  const flaggedIngredientIds = new Set<string>();

  for (const group of restrictions.avoidAllergenGroups) {
    const matchedIngredients = findMatchingIngredientNames(recipe.ingredients, group.keywords);

    if (matchedIngredients.length === 0) {
      continue;
    }

    for (const ingredient of recipe.ingredients) {
      if (matchedIngredients.includes(ingredient.name)) {
        flaggedIngredientIds.add(ingredient.id);
      }
    }

    conflicts.push({
      type: 'allergen',
      label: group.tagName,
      tagId: group.tagId,
      matchedIngredients,
    });
  }

  for (const term of restrictions.customAvoidTerms) {
    const matchedIngredients = recipe.ingredients
      .filter((ingredient) => ingredientMatchesKeyword(ingredient.name, term))
      .map((ingredient) => ingredient.name);

    if (matchedIngredients.length === 0) {
      continue;
    }

    for (const ingredient of recipe.ingredients) {
      if (matchedIngredients.includes(ingredient.name)) {
        flaggedIngredientIds.add(ingredient.id);
      }
    }

    conflicts.push({
      type: 'custom',
      label: term,
      tagId: null,
      matchedIngredients,
    });
  }

  const recipeTagIdSet = new Set(recipe.tagIds);

  for (const dietTagId of restrictions.dietTagIds) {
    if (recipeTagIdSet.has(dietTagId)) {
      continue;
    }

    const label = restrictions.dietTagNames.get(dietTagId) ?? 'Preferencia dietética';

    conflicts.push({
      type: 'diet',
      label,
      tagId: dietTagId,
      matchedIngredients: [],
    });
  }

  return {
    conflicts,
    flaggedIngredientIds: [...flaggedIngredientIds],
  };
}

function findMatchingIngredientNames(
  ingredients: readonly { name: string }[],
  keywords: readonly string[],
): string[] {
  const matched = new Set<string>();

  for (const ingredient of ingredients) {
    for (const keyword of keywords) {
      if (ingredientMatchesKeyword(ingredient.name, keyword)) {
        matched.add(ingredient.name);
      }
    }
  }

  return [...matched];
}

export function hasCompatibilityWarning(conflicts: readonly unknown[]): boolean {
  return conflicts.length > 0;
}
