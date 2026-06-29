export function resolveRecipeTotalDurationMinutes(
  stepDurations: readonly (number | null)[],
): number {
  let total = 0;

  for (const duration of stepDurations) {
    total += duration ?? 0;
  }

  return total;
}

export function toRecipeListDurationMinutes(totalMinutes: number): number | null {
  return totalMinutes > 0 ? totalMinutes : null;
}

export function computeStoredRecipeTotalDurationMinutes(
  stepDurations: readonly (number | null | undefined)[],
): number | null {
  return toRecipeListDurationMinutes(
    resolveRecipeTotalDurationMinutes(stepDurations.map((duration) => duration ?? null)),
  );
}
