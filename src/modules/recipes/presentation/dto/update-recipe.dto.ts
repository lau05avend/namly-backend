import { Trim } from '@common/decorators/trim.decorator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import type { UpdateRecipeParams } from '../../domain/interfaces/update-recipe-params.interface';
import { UpdateRecipeIngredientDto } from './update-recipe-ingredient.dto';
import { UpdateRecipeStepDto } from './update-recipe-step.dto';

export class UpdateRecipeDto implements UpdateRecipeParams {
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string | null;

  @Trim()
  @IsOptional()
  @IsUrl()
  coverUrl?: string | null;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRecipeIngredientDto)
  ingredients?: UpdateRecipeIngredientDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateRecipeStepDto)
  steps?: UpdateRecipeStepDto[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];
}
