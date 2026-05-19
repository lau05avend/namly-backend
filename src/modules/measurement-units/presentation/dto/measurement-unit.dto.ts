import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class MeasurementUnitDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  abbreviation!: string;

  @IsString()
  category!: string;

  @IsBoolean()
  isConvertible!: boolean;

  @IsBoolean()
  isDefault!: boolean;
}
