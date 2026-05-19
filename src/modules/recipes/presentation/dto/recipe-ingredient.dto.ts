import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { MeasurementUnitDto } from '@modules/measurement-units/presentation/dto/measurement-unit.dto';

export class RecipeIngredientDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsNumber()
  quantity?: number | null;

  @IsOptional()
  @IsUUID()
  unitId?: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => MeasurementUnitDto)
  unit!: MeasurementUnitDto | null;
}
