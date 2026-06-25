import { ApiPropertyOptional } from '@nestjs/swagger';
import { Trim } from '@common/decorators/trim.decorator';
import { IsOptional, Matches } from 'class-validator';
import { SwaggerExamples } from '@/docs/swagger/swagger.examples';

export class GetAnalyticsRhythmQueryDto {
  @ApiPropertyOptional({
    description: 'Inicio de semana (lunes) en formato YYYY-MM-DD. Por defecto: semana actual.',
    example: SwaggerExamples.date.weekStart,
  })
  @IsOptional()
  @Trim()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  weekStart?: string;
}
