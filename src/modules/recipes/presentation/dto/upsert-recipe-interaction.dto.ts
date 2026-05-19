import { IsBoolean, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import type { UpsertRecipeInteractionParams } from '../../domain/interfaces/upsert-recipe-interaction-params.interface';

export class UpsertRecipeInteractionDto implements UpsertRecipeInteractionParams {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  publicComment?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  privateNotes?: string | null;

  @IsOptional()
  @IsBoolean()
  isFavorite?: boolean;

  @IsOptional()
  @IsBoolean()
  isHidden?: boolean;
}
