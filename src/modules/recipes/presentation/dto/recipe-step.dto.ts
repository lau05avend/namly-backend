import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class RecipeStepDto {
  @IsUUID()
  id!: string;

  @IsInt()
  @Min(1)
  stepOrder!: number;

  @IsString()
  description!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  durationMinutes!: number | null;
}
