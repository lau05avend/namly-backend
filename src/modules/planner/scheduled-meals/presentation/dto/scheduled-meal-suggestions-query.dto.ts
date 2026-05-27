import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';

export class ScheduledMealSuggestionsQueryDto {
  @IsDate()
  @Type(() => Date)
  loggedAt!: Date;
}
