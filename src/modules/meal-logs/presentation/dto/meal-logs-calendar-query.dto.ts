import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class MealLogsCalendarQueryDto {
  @ApiProperty({ description: 'Año', example: 2026 })
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  year!: number;

  @ApiProperty({ description: 'Mes (1-12)', example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;
}
