export const ALLERGEN_TAG_CATEGORY = 'allergens';

export const RECIPE_DIET_TAG_CATEGORY = 'recipes';

export const ONBOARDING_ALLERGIES_QUESTION_SORT_ORDER = 2;

export const ONBOARDING_DIET_QUESTION_SORT_ORDER = 3;

export const ONBOARDING_SKIP_OPTION_LABELS = new Set([
  'Ninguna por ahora',
  'Sin restricciones',
]);

export type CompatibilityConflictType = 'allergen' | 'diet' | 'custom';
