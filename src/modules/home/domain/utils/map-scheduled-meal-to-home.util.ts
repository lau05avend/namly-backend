import type { ScheduledMealEntity } from '@modules/planner/scheduled-meals/domain/entities/scheduled-meal.entity';
import { SCHEDULED_MEAL_MAX_RECIPES } from '@modules/planner/scheduled-meals/domain/constants/scheduled-meal.constants';
import { formatPlannedTimeLabel } from './format-planned-time-label.util';
import type { HomeScheduledMealEntity } from '../entities/home-scheduled-meal.entity';
export function mapScheduledMealToHomeEntity(meal: ScheduledMealEntity): HomeScheduledMealEntity {
  const recipes = meal.isExpress
    ? []
    : [...meal.recipes].sort((left, right) => left.sortOrder - right.sortOrder);

  const title = resolveScheduledMealTitle(meal, recipes);
  const visibleRecipes = recipes.slice(0, SCHEDULED_MEAL_MAX_RECIPES);
  const items = visibleRecipes.map((recipe) => ({
    id: recipe.id,
    label: recipe.title,
  }));

  return {
    id: meal.id,
    mealType: meal.mealType,
    entryDate: meal.entryDate,
    plannedTime: meal.plannedTime,
    plannedTimeLabel: formatPlannedTimeLabel(meal.plannedTime),
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
