import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  ValidateNested,
} from 'class-validator';
import { MealLogMealTypeDto } from './meal-log-meal-type.dto';
import { MealLogRecipeDto } from './meal-log-recipe.dto';

export class MealLogScheduledMealDto {
  @IsUUID()
  id!: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  entryDate!: string;

  @Matches(/^\d{2}:\d{2}:\d{2}$/)
  plannedTime!: string;

  @IsBoolean()
  isExpress!: boolean;

  @IsOptional()
  @IsString()
  expressNote!: string | null;

  @ValidateNested()
  @Type(() => MealLogMealTypeDto)
  mealType!: MealLogMealTypeDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealLogRecipeDto)
  recipes!: MealLogRecipeDto[];

  @IsOptional()
  totalDurationMinutes!: number | null;
}
