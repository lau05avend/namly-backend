import { toPlannedInstant } from '@modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util';

export function resolveReminderDueAt(
  entryDate: Date,
  plannedTime: Date,
  offsetMinutes: number,
): Date {
  const plannedAt = toPlannedInstant(entryDate, plannedTime);

  return new Date(plannedAt.getTime() - offsetMinutes * 60_000);
}
