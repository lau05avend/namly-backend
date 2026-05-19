import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class RecipeInteractionDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number | null;

  @IsOptional()
  @IsString()
  publicComment!: string | null;

  @IsOptional()
  @IsString()
  privateNotes!: string | null;

  @IsBoolean()
  isFavorite!: boolean;

  @IsBoolean()
  isHidden!: boolean;
}
