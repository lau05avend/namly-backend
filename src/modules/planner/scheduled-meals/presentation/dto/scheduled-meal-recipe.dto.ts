import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class ScheduledMealRecipeDto {
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
  @Min(1)
  sortOrder!: number;
}
