import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import type { CreateRecipeStepParams } from '../../domain/interfaces/create-recipe-step-params.interface';

export class CreateRecipeStepDto implements CreateRecipeStepParams {
  @IsInt()
  @Min(1)
  stepOrder!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationMinutes?: number | null;
}
