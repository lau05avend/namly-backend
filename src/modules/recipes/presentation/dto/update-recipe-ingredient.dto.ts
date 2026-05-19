import { Trim } from '@common/decorators/trim.decorator';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import type { UpdateRecipeIngredientParams } from '../../domain/interfaces/update-recipe-ingredient-params.interface';

export class UpdateRecipeIngredientDto implements UpdateRecipeIngredientParams {
  @IsOptional()
  @IsUUID()
  id?: string;

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
