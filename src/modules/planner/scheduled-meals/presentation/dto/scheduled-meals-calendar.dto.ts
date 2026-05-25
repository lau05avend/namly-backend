import { IsArray, IsString, Matches } from 'class-validator';

export class ScheduledMealsCalendarDto {
  @IsArray()
  @IsString({ each: true })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { each: true })
  days!: string[];
}
