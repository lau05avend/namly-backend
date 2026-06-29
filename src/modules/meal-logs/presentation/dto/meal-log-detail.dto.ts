import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { MealLogMealTypeDto } from './meal-log-meal-type.dto';
import { MealLogRecipeDto } from './meal-log-recipe.dto';
import { MealLogScheduledMealDto } from './meal-log-scheduled-meal.dto';
import { MealLogTagDto } from './meal-log-tag.dto';

export class MealLogDetailDto {
  @IsUUID()
  id!: string;

  @IsString()
  mediaUrl!: string;

  @IsOptional()
  @IsString()
  content!: string | null;

  @IsOptional()
  @IsInt()
  score!: number | null;

  @IsDate()
  @Type(() => Date)
  loggedAt!: Date;

  @IsOptional()
  @ValidateNested()
  @Type(() => MealLogMealTypeDto)
  mealType!: MealLogMealTypeDto | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => MealLogScheduledMealDto)
  scheduledMeal!: MealLogScheduledMealDto | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealLogRecipeDto)
  recipes!: MealLogRecipeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MealLogTagDto)
  tags!: MealLogTagDto[];

  @IsOptional()
  totalDurationMinutes!: number | null;
}
