type RecipeLinkWithDuration = {
  readonly durationMinutes: number | null;
};

export function resolveRecipeLinksTotalDurationMinutes(
  recipeLinks: readonly RecipeLinkWithDuration[],
): number | null {
  if (recipeLinks.length === 0) {
    return null;
  }

  let total = 0;
  let hasAnyDuration = false;

  for (const recipeLink of recipeLinks) {
    if (recipeLink.durationMinutes !== null && recipeLink.durationMinutes > 0) {
      total += recipeLink.durationMinutes;
      hasAnyDuration = true;
    }
  }

  return hasAnyDuration ? total : null;
}
