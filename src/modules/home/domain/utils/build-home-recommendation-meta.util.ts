const META_SEPARATOR = ' · ';
const META_FALLBACK = 'Receta sugerida';

export function buildHomeRecommendationMeta(tagNames: readonly string[]): string {
  if (tagNames.length === 0) {
    return META_FALLBACK;
  }

  return tagNames.join(META_SEPARATOR);
}
