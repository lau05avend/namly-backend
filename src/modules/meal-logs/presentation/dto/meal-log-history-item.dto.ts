import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { MealLogMealTypeDto } from './meal-log-meal-type.dto';

export class MealLogHistoryItemDto {
  @IsUUID()
  id!: string;

  @IsString()
  mediaUrl!: string;

  @IsDate()
  @Type(() => Date)
  loggedAt!: Date;

  @IsString()
  loggedAtTime!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => MealLogMealTypeDto)
  mealType!: MealLogMealTypeDto | null;

  @IsBoolean()
  isLinkedToPlan!: boolean;
}
