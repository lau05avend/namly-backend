import { IsInt, IsUUID, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  MAX_REMINDER_OFFSET_MINUTES,
  MIN_REMINDER_OFFSET_MINUTES,
} from '@modules/planner/reminders/domain/constants/scheduled-meal-reminder.constants';

export class ScheduledMealReminderDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'Minutos antes de plannedTime. 0 = a la hora en punto.',
    minimum: MIN_REMINDER_OFFSET_MINUTES,
    maximum: MAX_REMINDER_OFFSET_MINUTES,
  })
  @IsInt()
  @Min(MIN_REMINDER_OFFSET_MINUTES)
  @Max(MAX_REMINDER_OFFSET_MINUTES)
  offsetMinutes!: number;
}
