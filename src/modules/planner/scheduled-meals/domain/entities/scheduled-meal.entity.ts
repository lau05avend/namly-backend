import type { ScheduledMealMealTypeEntity } from './scheduled-meal-meal-type.entity';
import type { ScheduledMealRecipeEntity } from './scheduled-meal-recipe.entity';
import type { ScheduledMealCompletionMealLogEntity } from './scheduled-meal-completion-meal-log.entity';
import type { ScheduledMealReminderEntity } from '@modules/planner/reminders/domain/entities/scheduled-meal-reminder.entity';
import type { ScheduledMealStatus } from '../enums/scheduled-meal-status.enum';

export interface ScheduledMealEntity {
  readonly id: string;
  readonly mealTypeId: string;
  readonly mealType: ScheduledMealMealTypeEntity;
  readonly entryDate: string;
  readonly plannedTime: string;
  readonly isExpress: boolean;
  readonly expressNote: string | null;
  readonly recipes: readonly ScheduledMealRecipeEntity[];
  readonly totalDurationMinutes: number | null;
  readonly reminders: readonly ScheduledMealReminderEntity[];
  readonly status: ScheduledMealStatus;
  readonly completionMealLog: ScheduledMealCompletionMealLogEntity | null;
}
