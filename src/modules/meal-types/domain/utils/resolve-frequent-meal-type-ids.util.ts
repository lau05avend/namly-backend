type MealTypeForRanking = {
  readonly id: string;
  readonly sortOrder: number;
};

export function resolveFrequentMealTypeIds(
  userMealTypes: readonly MealTypeForRanking[],
  usageCountByMealTypeId: ReadonlyMap<string, number>,
  limit: number,
): readonly string[] {
  const sortedBySortOrder = [...userMealTypes].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );

  const totalUsage = sortedBySortOrder.reduce(
    (sum, mealType) => sum + (usageCountByMealTypeId.get(mealType.id) ?? 0),
    0,
  );

  if (totalUsage === 0) {
    return sortedBySortOrder.slice(0, limit).map((mealType) => mealType.id);
  }

  const sortedByUsage = [...userMealTypes].sort((left, right) => {
    const countDifference =
      (usageCountByMealTypeId.get(right.id) ?? 0) - (usageCountByMealTypeId.get(left.id) ?? 0);

    if (countDifference !== 0) {
      return countDifference;
    }

    return left.sortOrder - right.sortOrder;
  });

  const frequentIds: string[] = [];

  for (const mealType of sortedByUsage) {
    if (frequentIds.length >= limit) {
      break;
    }

    if ((usageCountByMealTypeId.get(mealType.id) ?? 0) > 0) {
      frequentIds.push(mealType.id);
    }
  }

  if (frequentIds.length < limit) {
    const selectedIds = new Set(frequentIds);

    for (const mealType of sortedBySortOrder) {
      if (frequentIds.length >= limit) {
        break;
      }

      if (!selectedIds.has(mealType.id)) {
        frequentIds.push(mealType.id);
      }
    }
  }

  return frequentIds;
}
