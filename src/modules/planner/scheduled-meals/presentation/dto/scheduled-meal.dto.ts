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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SCHEDULED_MEAL_STATUSES } from '../../domain/enums/scheduled-meal-status.enum';
import { ScheduledMealCompletionMealLogDto } from './scheduled-meal-completion-meal-log.dto';
import { ScheduledMealMealTypeDto } from './scheduled-meal-meal-type.dto';
import { ScheduledMealRecipeDto } from './scheduled-meal-recipe.dto';

export class ScheduledMealDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  mealTypeId!: string;

  @ApiProperty({ type: ScheduledMealMealTypeDto })
  @ValidateNested()
  @Type(() => ScheduledMealMealTypeDto)
  mealType!: ScheduledMealMealTypeDto;

  @ApiProperty({ example: '2026-05-26' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  entryDate!: string;

  @ApiProperty({ example: '07:30:00' })
  @Matches(/^\d{2}:\d{2}:\d{2}$/)
  plannedTime!: string;

  @ApiProperty()
  @IsBoolean()
  isExpress!: boolean;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  @IsString()
  expressNote!: string | null;

  @ApiPropertyOptional({ type: [ScheduledMealRecipeDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ScheduledMealRecipeDto)
  recipes?: ScheduledMealRecipeDto[];

  @ApiProperty({ enum: SCHEDULED_MEAL_STATUSES })
  @IsIn(SCHEDULED_MEAL_STATUSES)
  status!: (typeof SCHEDULED_MEAL_STATUSES)[number];

  @ApiPropertyOptional({
    description: 'Registro de comida que completó la planificación. Solo en detalle cuando status es completed.',
    type: ScheduledMealCompletionMealLogDto,
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ScheduledMealCompletionMealLogDto)
  completionMealLog?: ScheduledMealCompletionMealLogDto | null;
}
