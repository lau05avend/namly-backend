import { IsArray, Matches } from 'class-validator';

export class MealLogsCalendarDto {
  @IsArray()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { each: true })
  days!: string[];
}
