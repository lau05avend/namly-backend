import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  MAX_REMINDER_OFFSET_MINUTES,
  MIN_REMINDER_OFFSET_MINUTES,
} from '@modules/planner/reminders/domain/constants/scheduled-meal-reminder.constants';
import type { ScheduledMealReminderInput } from '@modules/planner/reminders/domain/rules/validate-scheduled-meal-reminders.util';

export class ScheduledMealReminderInputDto implements ScheduledMealReminderInput {
  @ApiProperty({
    description: 'Minutos antes de plannedTime. 0 = a la hora en punto.',
    minimum: MIN_REMINDER_OFFSET_MINUTES,
    maximum: MAX_REMINDER_OFFSET_MINUTES,
    example: 30,
  })
  @Type(() => Number)
  @IsInt()
  @Min(MIN_REMINDER_OFFSET_MINUTES)
  @Max(MAX_REMINDER_OFFSET_MINUTES)
  offsetMinutes!: number;
}
