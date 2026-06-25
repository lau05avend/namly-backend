import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ScheduledMealCompletionTagDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id!: string;

  @ApiProperty({ example: 'meal_logs' })
  @IsString()
  category!: string;

  @ApiProperty({ example: 'Saludable' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'leaf', nullable: true })
  @IsOptional()
  @IsString()
  iconName!: string | null;
}
