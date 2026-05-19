import { Trim } from '@common/decorators/trim.decorator';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import type { CreateRecipeIngredientParams } from '../../domain/interfaces/create-recipe-ingredient-params.interface';

export class CreateRecipeIngredientDto implements CreateRecipeIngredientParams {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @IsOptional()
  @IsNumber()
  quantity?: number | null;

  @IsOptional()
  @IsUUID()
  unitId?: string | null;
}
