import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  ValidateNested,
} from 'class-validator';
import { SCHEDULED_MEAL_STATUSES } from '../../domain/enums/scheduled-meal-status.enum';
import { ScheduledMealMealTypeDto } from './scheduled-meal-meal-type.dto';
import { ScheduledMealRecipeDto } from './scheduled-meal-recipe.dto';

export class ScheduledMealDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  mealTypeId!: string;

  @ValidateNested()
  @Type(() => ScheduledMealMealTypeDto)
  mealType!: ScheduledMealMealTypeDto;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  entryDate!: string;

  @Matches(/^\d{2}:\d{2}:\d{2}$/)
  plannedTime!: string;

  @IsBoolean()
  isExpress!: boolean;

  @IsOptional()
  @IsString()
  expressNote!: string | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ScheduledMealRecipeDto)
  recipes?: ScheduledMealRecipeDto[];

  @IsIn(SCHEDULED_MEAL_STATUSES)
  status!: (typeof SCHEDULED_MEAL_STATUSES)[number];
}
