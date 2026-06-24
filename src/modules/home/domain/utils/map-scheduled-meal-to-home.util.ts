import type { ScheduledMealEntity } from '@modules/planner/scheduled-meals/domain/entities/scheduled-meal.entity';
import { HOME_SCHEDULED_MEAL_VISIBLE_ITEMS } from '../constants/home.constants';
import type { HomeScheduledMealEntity } from '../entities/home-scheduled-meal.entity';

export function mapScheduledMealToHomeEntity(meal: ScheduledMealEntity): HomeScheduledMealEntity {
  const recipes = meal.isExpress
    ? []
    : [...meal.recipes].sort((left, right) => left.sortOrder - right.sortOrder);

  const title = resolveScheduledMealTitle(meal, recipes);
  const visibleRecipes = recipes.slice(0, HOME_SCHEDULED_MEAL_VISIBLE_ITEMS);
  const items = visibleRecipes.map((recipe) => ({
    id: recipe.id,
    label: recipe.title,
  }));

  return {
    id: meal.id,
    mealType: meal.mealType,
    entryDate: meal.entryDate,
    plannedTime: meal.plannedTime,
    isExpress: meal.isExpress,
    title,
    items,
    moreCount: Math.max(0, recipes.length - items.length),
  };
}

function resolveScheduledMealTitle(
  meal: ScheduledMealEntity,
  recipes: ScheduledMealEntity['recipes'],
): string {
  if (meal.isExpress) {
    return meal.expressNote?.trim() || meal.mealType.name;
  }

  if (recipes.length > 0) {
    return recipes[0].title;
  }

  return meal.mealType.name;
}
