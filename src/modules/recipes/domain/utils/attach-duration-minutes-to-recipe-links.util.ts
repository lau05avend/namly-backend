type RecipeLinkWithId = {
  readonly recipeId: string;
};

export function collectUniqueRecipeIds(
  ...recipeLinkGroups: readonly (readonly RecipeLinkWithId[])[]
): readonly string[] {
  const recipeIds = new Set<string>();

  for (const recipeLinks of recipeLinkGroups) {
    for (const recipeLink of recipeLinks) {
      recipeIds.add(recipeLink.recipeId);
    }
  }

  return [...recipeIds];
}

export function attachDurationMinutesToRecipeLinks<T extends RecipeLinkWithId>(
  recipeLinks: readonly T[],
  durationMinutesByRecipeId: ReadonlyMap<string, number | null>,
): Array<T & { readonly durationMinutes: number | null }> {
  return recipeLinks.map((recipeLink) => ({
    ...recipeLink,
    durationMinutes: durationMinutesByRecipeId.get(recipeLink.recipeId) ?? null,
  }));
}
