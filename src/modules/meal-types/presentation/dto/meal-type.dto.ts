import { IsBoolean, IsInt, IsString, IsUUID, Min } from 'class-validator';

export class MealTypeDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsInt()
  @Min(0)
  sortOrder!: number;

  @IsBoolean()
  isFrequent!: boolean;
}
