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
import { ScheduledMealMealTypeDto } from './scheduled-meal-meal-type.dto';
import { ScheduledMealRecipeDto } from './scheduled-meal-recipe.dto';

export class ScheduledMealSuggestionDto {
  @IsUUID()
  id!: string;

  @Matches(/^\d{2}:\d{2}:\d{2}$/)
  plannedTime!: string;

  @ValidateNested()
  @Type(() => ScheduledMealMealTypeDto)
  mealType!: ScheduledMealMealTypeDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduledMealRecipeDto)
  recipes!: ScheduledMealRecipeDto[];

  @IsBoolean()
  isExpress!: boolean;

  @IsOptional()
  @IsString()
  expressNote?: string | null;
}
