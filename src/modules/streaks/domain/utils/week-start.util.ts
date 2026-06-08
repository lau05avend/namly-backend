import {
  formatEntryDate,
  parseEntryDate,
} from '@modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util'; // TODO: mover a utils common
import { WEEK_START_DAY } from '../constants/streak.constants';

export function getWeekStart(entryDate: string): string {
  const date = parseEntryDate(entryDate);
  const dayOfWeek = date.getUTCDay();
  const daysSinceWeekStart = (dayOfWeek + 7 - WEEK_START_DAY) % 7;
  date.setUTCDate(date.getUTCDate() - daysSinceWeekStart);
  return formatEntryDate(date);
}
