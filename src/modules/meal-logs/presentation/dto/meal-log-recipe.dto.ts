import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class MealLogRecipeDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  recipeId!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  coverUrl!: string | null;

  @IsOptional()
  durationMinutes!: number | null;

  @IsInt()
  sortOrder!: number;
}
