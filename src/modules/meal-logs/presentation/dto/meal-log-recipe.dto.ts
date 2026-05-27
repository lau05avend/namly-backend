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

  @IsInt()
  sortOrder!: number;
}
