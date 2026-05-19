import { Trim } from '@common/decorators/trim.decorator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import type { CreateRecipeParams } from '../../domain/interfaces/create-recipe-params.interface';
import { CreateRecipeIngredientDto } from './create-recipe-ingredient.dto';
import { CreateRecipeStepDto } from './create-recipe-step.dto';

export class CreateRecipeDto implements CreateRecipeParams {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  ingredients!: CreateRecipeIngredientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeStepDto)
  steps!: CreateRecipeStepDto[];

  @IsArray()
  @IsUUID('4', { each: true })
  tagIds!: string[];
}
