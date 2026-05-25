import { Matches } from 'class-validator';

export class CalendarScheduledMealsQueryDto {
  @Matches(/^\d{4}-\d{2}$/)
  month!: string;
}
