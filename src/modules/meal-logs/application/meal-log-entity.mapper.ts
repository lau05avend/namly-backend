import { formatTimeToLocalString } from '@/modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util';
import { resolveRecipeLinksTotalDurationMinutes } from '@modules/recipes/domain/utils/resolve-recipe-links-total-duration-minutes.util';
import type { MealLogDetailEntity } from '../domain/entities/meal-log-detail.entity';
import type { MealLogHistoryItemEntity } from '../domain/entities/meal-log-history-item.entity';
import type {
  MealLogDetailRecord,
  MealLogHistoryRecord,
  MealLogRepository,
} from '../infrastructure/repositories/meal-log.repository';

export function toMealLogHistoryItemEntity(record: MealLogHistoryRecord): MealLogHistoryItemEntity {
  return {
    id: record.id,
    mediaUrl: record.mediaUrl ?? '',
    loggedAt: record.loggedAt,
    loggedAtTime: formatTimeToLocalString(record.loggedAt),
    mealType: record.mealType,
    isLinkedToPlan: record.scheduledMealId !== null,
  };
}

export function toMealLogDetailEntity(
  record: MealLogDetailRecord,
  repository: MealLogRepository,
): MealLogDetailEntity {
  const recipes = record.meal_log_recipes.map((item) => ({
    id: item.id,
    recipeId: item.recipe_id,
    title: item.recipes.title,
    coverUrl: item.recipes.coverUrl,
    durationMinutes: item.recipes.totalDurationMinutes,
    sortOrder: item.sort_order,
  }));

  const scheduledMealRecipes =
    record.scheduledMeal && record.scheduledMeal.isExpress !== true
      ? record.scheduledMeal.scheduledMealRecipes.map((item) => ({
          id: item.id,
          recipeId: item.recipeId,
          title: item.recipe.title,
          coverUrl: item.recipe.coverUrl,
          durationMinutes: item.recipe.totalDurationMinutes,
          sortOrder: item.sortOrder,
        }))
      : [];

  return {
    id: record.id,
    mediaUrl: record.mediaUrl ?? '',
    content: record.content,
    score: record.score,
    loggedAt: record.loggedAt,
    mealType: record.mealType,
    scheduledMeal: record.scheduledMeal
      ? {
          id: record.scheduledMeal.id,
          entryDate: repository.formatScheduledMealEntryDate(record.scheduledMeal.entryDate),
          plannedTime: repository.formatScheduledMealPlannedTime(record.scheduledMeal.plannedTime),
          isExpress: record.scheduledMeal.isExpress,
          expressNote: record.scheduledMeal.isExpress ? record.scheduledMeal.expressNote : null,
          mealType: record.scheduledMeal.mealType,
          recipes: scheduledMealRecipes,
          totalDurationMinutes: resolveRecipeLinksTotalDurationMinutes(scheduledMealRecipes),
        }
      : null,
    recipes,
    tags: record.tagLinks.map((link) => link.tag),
    totalDurationMinutes: resolveRecipeLinksTotalDurationMinutes(recipes),
  };
}
