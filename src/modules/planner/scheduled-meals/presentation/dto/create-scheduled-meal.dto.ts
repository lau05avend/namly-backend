import { Trim } from '@common/decorators/trim.decorator';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import {
  SCHEDULED_MEAL_MAX_RECIPES,
  SCHEDULED_MEAL_MIN_RECIPES,
} from '../../domain/constants/scheduled-meal.constants';
import type { CreateScheduledMealParams } from '../../domain/interfaces/create-scheduled-meal-params.interface';

export class CreateScheduledMealDto implements CreateScheduledMealParams {
  @IsUUID()
  mealTypeId!: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  entryDate!: string;

  @Matches(/^\d{2}:\d{2}(:\d{2})?$/)
  plannedTime!: string;

  @IsBoolean()
  isExpress!: boolean;

  @ValidateIf((dto: CreateScheduledMealDto) => dto.isExpress)
  @Trim()
  @IsString()
  @MaxLength(500)
  expressNote?: string | null;

  @ValidateIf((dto: CreateScheduledMealDto) => !dto.isExpress)
  @IsArray()
  @ArrayMinSize(SCHEDULED_MEAL_MIN_RECIPES)
  @ArrayMaxSize(SCHEDULED_MEAL_MAX_RECIPES)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  recipeIds?: string[];
}
