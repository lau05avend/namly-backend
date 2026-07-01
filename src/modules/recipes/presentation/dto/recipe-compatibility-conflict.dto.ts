import { IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import type { CompatibilityConflictType } from '@shared/food-preferences/food-preferences.constants';

export class RecipeCompatibilityConflictDto {
  @IsIn(['allergen', 'diet', 'custom'])
  type!: CompatibilityConflictType;

  @IsString()
  label!: string;

  @IsOptional()
  @IsUUID()
  tagId!: string | null;

  @IsString({ each: true })
  matchedIngredients!: string[];
}
