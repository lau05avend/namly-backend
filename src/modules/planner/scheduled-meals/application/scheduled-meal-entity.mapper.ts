import type { ScheduledMealEntity } from '../domain/entities/scheduled-meal.entity';
import type { ScheduledMealStatus } from '../domain/enums/scheduled-meal-status.enum';
import type { ScheduledMealStatusInput } from '../domain/interfaces/scheduled-meal-status-input.interface';
import { formatEntryDate, formatPlannedTime } from '../domain/utils/scheduled-meal-datetime.util';
import { resolveRecipeLinksTotalDurationMinutes } from '@modules/recipes/domain/utils/resolve-recipe-links-total-duration-minutes.util';
import {
  type ScheduledMealCompletionRecord,
  type ScheduledMealRepository,
  type ScheduledMealRecord,
} from '../infrastructure/repositories/scheduled-meal.repository';

export function toScheduledMealStatusInput(
  record: Pick<ScheduledMealRecord, 'id' | 'entryDate' | 'plannedTime' | 'mealLogs'>,
  repository: ScheduledMealRepository,
): ScheduledMealStatusInput {
  return {
    id: record.id,
    entryDate: formatEntryDate(record.entryDate),
    plannedTime: formatPlannedTime(record.plannedTime),
    hasMealLog: repository.hasMealLog(record),
  };
}

export function toScheduledMealEntity(
  record: ScheduledMealRecord,
  status: ScheduledMealStatus,
  repository: ScheduledMealRepository,
  completionMealLogRecord?: ScheduledMealCompletionRecord | null,
): ScheduledMealEntity {
  const recipes = record.isExpress ? [] : repository.toRecipeEntities(record.scheduledMealRecipes);

  return {
    id: record.id,
    mealTypeId: record.mealTypeId,
    mealType: record.mealType,
    entryDate: formatEntryDate(record.entryDate),
    plannedTime: formatPlannedTime(record.plannedTime),
    isExpress: record.isExpress,
    expressNote: record.isExpress ? record.expressNote : null,
    recipes,
    totalDurationMinutes: resolveRecipeLinksTotalDurationMinutes(recipes),
    status,
    completionMealLog: mapCompletionMealLog(completionMealLogRecord),
  };
}

function mapCompletionMealLog(
  record: ScheduledMealCompletionRecord | null | undefined,
): ScheduledMealEntity['completionMealLog'] {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    mediaUrl: record.mediaUrl,
    loggedAt: record.loggedAt,
    content: record.content,
    tags: record.tagLinks.map((link) => link.tag),
  };
}
