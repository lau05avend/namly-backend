import { SCHEDULED_MEAL_MIN_RECIPES } from '../constants/scheduled-meal.constants';

export function getMealFlowValidationError(
  isExpress: boolean,
  expressNote: string | null | undefined,
  recipeIds: readonly string[] | undefined,
): string | null {
  if (isExpress) {
    if (recipeIds !== undefined && recipeIds.length > 0) {
      return 'Express meals cannot include recipes';
    }

    if (!expressNote) {
      return 'expressNote is required for express meals';
    }

    return null;
  }

  if (expressNote !== undefined && expressNote !== null && expressNote.length > 0) {
    return 'Non-express meals cannot include expressNote';
  }

  if (!recipeIds || recipeIds.length < SCHEDULED_MEAL_MIN_RECIPES) {
    return 'Recipes are required for non-express meals';
  }

  return null;
}
