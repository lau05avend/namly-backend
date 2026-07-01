import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsUUID, ValidateNested } from 'class-validator';
import { RecipeIngredientDto } from './recipe-ingredient.dto';
import { RecipeCompatibilityConflictDto } from './recipe-compatibility-conflict.dto';
import { RecipeInteractionDto } from './recipe-interaction.dto';
import { RecipeStepDto } from './recipe-step.dto';
import { RecipeSummaryDto } from './recipe-summary.dto';
import { RecipeTagDto } from './recipe-tag.dto';

export class RecipeDetailDto {
  @ValidateNested()
  @Type(() => RecipeSummaryDto)
  recipe!: RecipeSummaryDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  ingredients!: RecipeIngredientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeStepDto)
  steps!: RecipeStepDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeTagDto)
  tags!: RecipeTagDto[];

  @ValidateNested()
  @Type(() => RecipeInteractionDto)
  interaction!: RecipeInteractionDto;

  @IsBoolean()
  canEdit!: boolean;

  @IsBoolean()
  canDelete!: boolean;

  @IsBoolean()
  hasCompatibilityWarning!: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeCompatibilityConflictDto)
  compatibilityConflicts!: RecipeCompatibilityConflictDto[];

  @IsArray()
  @IsUUID('4', { each: true })
  flaggedIngredientIds!: string[];
}
