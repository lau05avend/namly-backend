import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { SwaggerExamples } from '@/docs/swagger/swagger.examples';

export class ListMealLogsQueryDto {
  @ApiProperty({
    description: 'Fecha local en formato YYYY-MM-DD',
    example: SwaggerExamples.date.entry,
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  entryDate!: string;
}
