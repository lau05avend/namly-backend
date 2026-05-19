export const RECIPE_LIST_FILTERS = [
  'all',
  'suggested',
  'public',
  'own',
  'favorites',
  'hidden',
] as const;

export type RecipeListFilter = (typeof RECIPE_LIST_FILTERS)[number];
