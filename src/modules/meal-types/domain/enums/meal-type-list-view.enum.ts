export const MEAL_TYPE_LIST_VIEWS = ['all', 'frequent'] as const;

export type MealTypeListView = (typeof MEAL_TYPE_LIST_VIEWS)[number];
