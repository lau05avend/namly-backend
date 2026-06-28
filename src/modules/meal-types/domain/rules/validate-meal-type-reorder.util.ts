export type MealTypeReorderValidationError = 'incomplete' | 'unknown-id';

export function validateMealTypeReorder(
  existingIds: readonly string[],
  orderedMealTypeIds: readonly string[],
): MealTypeReorderValidationError | null {
  if (orderedMealTypeIds.length !== existingIds.length) {
    return 'incomplete';
  }

  const existingIdSet = new Set(existingIds);

  for (const mealTypeId of orderedMealTypeIds) {
    if (!existingIdSet.has(mealTypeId)) {
      return 'unknown-id';
    }
  }

  return null;
}
