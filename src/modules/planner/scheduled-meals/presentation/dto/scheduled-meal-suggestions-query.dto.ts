import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsUUID } from 'class-validator';
import { SwaggerExamples } from '@/docs/swagger/swagger.examples';

export class ScheduledMealSuggestionsQueryDto {
  @ApiProperty({
    description: 'Momento del registro de comida',
    example: SwaggerExamples.datetime.suggestionLoggedAt,
  })
  @IsDate()
  @Type(() => Date)
  loggedAt!: Date;

  @ApiPropertyOptional({
    description: 'Comida planificada fijada manualmente',
    example: SwaggerExamples.uuid.scheduledMeal,
  })
  @IsOptional()
  @IsUUID()
  scheduledMealId?: string;
}
