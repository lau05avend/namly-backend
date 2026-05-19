import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import type { UpdateRecipeStepParams } from '../../domain/interfaces/update-recipe-step-params.interface';

export class UpdateRecipeStepDto implements UpdateRecipeStepParams {
  @IsOptional()
  @IsUUID()
  id?: string;

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
