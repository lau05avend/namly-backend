import { Trim } from '@common/decorators/trim.decorator';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';
import type { CreateMealTypeParams } from '../../domain/interfaces/create-meal-type-params.interface';

export class CreateMealTypeDto implements CreateMealTypeParams {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @IsInt()
  @Min(0)
  sortOrder!: number;
}
