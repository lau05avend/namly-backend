import type { MealTypeListView } from '../enums/meal-type-list-view.enum';

export interface GetUserMealTypesOptions {
  readonly view: MealTypeListView;
  readonly limit: number;
}
