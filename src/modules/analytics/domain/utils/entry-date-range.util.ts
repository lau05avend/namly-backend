import {
  formatEntryDate,
  parseEntryDate,
} from '@modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util';

export function addDays(entryDate: string, days: number): string {
  const date = parseEntryDate(entryDate);
  date.setUTCDate(date.getUTCDate() + days);
  return formatEntryDate(date);
}

export function getWeekEnd(weekStart: string): string {
  return addDays(weekStart, 6);
}

export function getWeekDayDates(weekStart: string): string[] {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}
