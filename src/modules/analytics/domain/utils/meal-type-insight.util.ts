const MEAL_TYPE_INSIGHT_ICONS: Record<string, string> = {
  Desayuno: 'sun',
  'Media mañana': 'coffee',
  Almuerzo: 'utensils',
  Merienda: 'cookie',
  Cena: 'moon',
  Snack: 'apple',
};

export function resolveMealTypeInsightIcon(mealTypeName: string): string {
  return MEAL_TYPE_INSIGHT_ICONS[mealTypeName] ?? 'utensils';
}

export function buildMealTypeInsightMessage(mealTypeName: string): string {
  return `Tu ${mealTypeName.toLowerCase()} es tu comida más constante`;
}
