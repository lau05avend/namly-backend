import {
  MAX_REMINDER_OFFSET_MINUTES,
  MAX_REMINDERS_PER_SCHEDULED_MEAL,
  MIN_REMINDER_OFFSET_MINUTES,
} from '../constants/scheduled-meal-reminder.constants';

export type ScheduledMealReminderInput = {
  readonly offsetMinutes: number;
};

export function validateScheduledMealReminders(
  reminders: readonly ScheduledMealReminderInput[] | undefined,
): string | null {
  if (reminders === undefined) {
    return null;
  }

  if (reminders.length > MAX_REMINDERS_PER_SCHEDULED_MEAL) {
    return `A scheduled meal can have at most ${MAX_REMINDERS_PER_SCHEDULED_MEAL} reminders`;
  }

  const seenOffsets = new Set<number>();

  for (const reminder of reminders) {
    if (!Number.isInteger(reminder.offsetMinutes)) {
      return 'Reminder offset minutes must be an integer';
    }

    if (
      reminder.offsetMinutes < MIN_REMINDER_OFFSET_MINUTES ||
      reminder.offsetMinutes > MAX_REMINDER_OFFSET_MINUTES
    ) {
      return `Reminder offset must be between ${MIN_REMINDER_OFFSET_MINUTES} and ${MAX_REMINDER_OFFSET_MINUTES} minutes`;
    }

    if (seenOffsets.has(reminder.offsetMinutes)) {
      return 'Duplicate reminder offsets are not allowed';
    }

    seenOffsets.add(reminder.offsetMinutes);
  }

  return null;
}
