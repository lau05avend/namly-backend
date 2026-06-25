import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Matches } from 'class-validator';
import { SwaggerExamples } from '@/docs/swagger/swagger.examples';

export class GetHomeQueryDto {
  @ApiPropertyOptional({
    description: 'Fecha local en formato YYYY-MM-DD. Por defecto: hoy.',
    example: SwaggerExamples.date.entry,
  })
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;
}
