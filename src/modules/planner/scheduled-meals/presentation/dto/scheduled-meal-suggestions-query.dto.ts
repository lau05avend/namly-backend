import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsUUID } from 'class-validator';

export class ScheduledMealSuggestionsQueryDto {
  @IsDate()
  @Type(() => Date)
  loggedAt!: Date;

  @IsOptional()
  @IsUUID()
  scheduledMealId?: string;
}
