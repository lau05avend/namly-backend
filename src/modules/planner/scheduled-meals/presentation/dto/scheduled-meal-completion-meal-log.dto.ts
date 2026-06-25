import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString, IsUrl, IsUUID, ValidateNested } from 'class-validator';
import { SwaggerExamples } from '@/docs/swagger/swagger.examples';
import { ScheduledMealCompletionTagDto } from './scheduled-meal-completion-tag.dto';

export class ScheduledMealCompletionMealLogDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;

  @ApiPropertyOptional({
    description: 'URL de la foto del registro',
    example: SwaggerExamples.url.mealLogMedia,
    nullable: true,
  })
  @IsOptional()
  @IsUrl()
  mediaUrl!: string | null;

  @ApiProperty({ example: SwaggerExamples.datetime.mealLogLoggedAt })
  @IsDate()
  @Type(() => Date)
  loggedAt!: Date;

  @ApiPropertyOptional({ example: 'Desayuno completo', nullable: true })
  @IsOptional()
  @IsString()
  content!: string | null;

  @ApiProperty({ type: [ScheduledMealCompletionTagDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduledMealCompletionTagDto)
  tags!: ScheduledMealCompletionTagDto[];
}
