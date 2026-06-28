import type { MealTypeEntity } from '../entities/meal-type.entity';
import type { MealTypeListItemEntity } from '../entities/meal-type-list-item.entity';

export function resolveFrequentMealTypes(
  userMealTypes: readonly MealTypeEntity[],
  frequentMealTypeIds: readonly string[],
): MealTypeListItemEntity[] {
  const mealTypeById = new Map(userMealTypes.map((mealType) => [mealType.id, mealType]));

  return frequentMealTypeIds.flatMap((mealTypeId) => {
    const mealType = mealTypeById.get(mealTypeId);

    if (!mealType) {
      return [];
    }

    return [
      {
        id: mealType.id,
        name: mealType.name,
        sortOrder: mealType.sortOrder,
        isFrequent: true,
      },
    ];
  });
}

export function resolveAllMealTypesWithFrequentFlag(
  userMealTypes: readonly MealTypeEntity[],
  frequentMealTypeIds: readonly string[],
): MealTypeListItemEntity[] {
  const frequentMealTypeIdSet = new Set(frequentMealTypeIds);

  return userMealTypes.map((mealType) => ({
    id: mealType.id,
    name: mealType.name,
    sortOrder: mealType.sortOrder,
    isFrequent: frequentMealTypeIdSet.has(mealType.id),
  }));
}
