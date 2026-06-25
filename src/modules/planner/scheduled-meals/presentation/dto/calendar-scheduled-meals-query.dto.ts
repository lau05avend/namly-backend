import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { SwaggerExamples } from '@/docs/swagger/swagger.examples';

export class CalendarScheduledMealsQueryDto {
  @ApiProperty({
    description: 'Mes en formato YYYY-MM',
    example: SwaggerExamples.date.month,
  })
  @Matches(/^\d{4}-\d{2}$/)
  month!: string;
}
