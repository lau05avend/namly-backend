import {
  formatEntryDate,
  parseEntryDate,
} from '@modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util';

export function previousDay(entryDate: string): string {
  const date = parseEntryDate(entryDate);
  date.setUTCDate(date.getUTCDate() - 1);
  return formatEntryDate(date);
}

export function nextDay(entryDate: string): string {
  const date = parseEntryDate(entryDate);
  date.setUTCDate(date.getUTCDate() + 1);
  return formatEntryDate(date);
}

export function subtractDays(entryDate: string, days: number): string {
  const date = parseEntryDate(entryDate);
  date.setUTCDate(date.getUTCDate() - days);
  return formatEntryDate(date);
}

export function isConsecutiveDay(earlierDate: string, laterDate: string): boolean {
  return nextDay(earlierDate) === laterDate;
}
