import { Type } from 'class-transformer';
import { IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { RecipeIngredientDto } from './recipe-ingredient.dto';
import { RecipeInteractionDto } from './recipe-interaction.dto';
import { RecipeOriginDto } from './recipe-origin.dto';
import { RecipeStepDto } from './recipe-step.dto';
import { RecipeSummaryDto } from './recipe-summary.dto';
import { RecipeTagDto } from './recipe-tag.dto';

export class RecipeDetailDto {
  @ValidateNested()
  @Type(() => RecipeSummaryDto)
  recipe!: RecipeSummaryDto;

  @ValidateNested()
  @Type(() => RecipeOriginDto)
  origin!: RecipeOriginDto;

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
}
