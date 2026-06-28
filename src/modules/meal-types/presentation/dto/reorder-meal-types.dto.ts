import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsUUID } from 'class-validator';

export class ReorderMealTypesDto {
  @ApiProperty({
    description: 'IDs de tipos de comida en el orden deseado (posición = sortOrder)',
    type: String,
    isArray: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  mealTypeIds!: string[];
}
