const META_SEPARATOR = ' · ';
const META_FALLBACK = 'Receta sugerida';

export function buildHomeRecommendationMeta(
  tagNames: readonly string[],
  totalDurationMinutes: number,
): string {
  const parts = [...tagNames];

  if (totalDurationMinutes > 0) {
    parts.push(`${totalDurationMinutes} min`);
  }

  if (parts.length === 0) {
    return META_FALLBACK;
  }

  return parts.join(META_SEPARATOR);
}
