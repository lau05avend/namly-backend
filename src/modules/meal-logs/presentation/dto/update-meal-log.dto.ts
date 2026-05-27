import { Trim } from '@common/decorators/trim.decorator';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import {
  MEAL_LOG_MAX_RECIPES,
  MEAL_LOG_MAX_SCORE,
  MEAL_LOG_MIN_SCORE,
} from '../../domain/constants/meal-log.constants';
import type { UpdateMealLogParams } from '../../domain/interfaces/update-meal-log-params.interface';

export class UpdateMealLogDto implements UpdateMealLogParams {
  @IsOptional()
  @IsUUID()
  scheduledMealId?: string | null;

  @IsOptional()
  @IsUUID()
  mealTypeId?: string | null;

  @Trim()
  @IsNotEmpty()
  @IsUrl()
  mediaUrl!: string;

  @IsOptional()
  @Trim()
  @IsString()
  content?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(MEAL_LOG_MIN_SCORE)
  @Max(MEAL_LOG_MAX_SCORE)
  score?: number | null;

  @IsDate()
  @Type(() => Date)
  loggedAt!: Date;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MEAL_LOG_MAX_RECIPES)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  recipeIds?: string[];
}
