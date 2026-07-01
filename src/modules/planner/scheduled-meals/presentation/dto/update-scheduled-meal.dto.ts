import { Trim } from '@common/decorators/trim.decorator';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  ArrayMinSize,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { MAX_REMINDERS_PER_SCHEDULED_MEAL } from '@modules/planner/reminders/domain/constants/scheduled-meal-reminder.constants';
import {
  SCHEDULED_MEAL_MAX_RECIPES,
  SCHEDULED_MEAL_MIN_RECIPES,
} from '../../domain/constants/scheduled-meal.constants';
import type { UpdateScheduledMealParams } from '../../domain/interfaces/update-scheduled-meal-params.interface';
import { ScheduledMealReminderInputDto } from './scheduled-meal-reminder-input.dto';

export class UpdateScheduledMealDto implements UpdateScheduledMealParams {
  @IsOptional()
  @IsUUID()
  mealTypeId?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  entryDate?: string;

  @IsOptional()
  @Matches(/^\d{2}:\d{2}(:\d{2})?$/)
  plannedTime?: string;

  @IsOptional()
  @IsBoolean()
  isExpress?: boolean;

  @ValidateIf((dto: UpdateScheduledMealDto) => dto.isExpress === true)
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  expressNote?: string | null;

  @ValidateIf((dto: UpdateScheduledMealDto) => dto.isExpress === false)
  @IsOptional()
  @IsArray()
  @ArrayMinSize(SCHEDULED_MEAL_MIN_RECIPES)
  @ArrayMaxSize(SCHEDULED_MEAL_MAX_RECIPES)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  recipeIds?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(MAX_REMINDERS_PER_SCHEDULED_MEAL)
  @ValidateNested({ each: true })
  @Type(() => ScheduledMealReminderInputDto)
  reminders?: ScheduledMealReminderInputDto[];
}
