import type { ScheduledMealReminderInput } from '@modules/planner/reminders/domain/rules/validate-scheduled-meal-reminders.util';

export interface CreateScheduledMealParams {
  mealTypeId: string;
  entryDate: string;
  plannedTime: string;
  isExpress: boolean;
  expressNote?: string | null;
  recipeIds?: readonly string[];
  reminders?: readonly ScheduledMealReminderInput[];
}
