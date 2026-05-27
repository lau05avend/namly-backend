import { IsInt, IsString, IsUUID } from 'class-validator';

export class MealLogMealTypeDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsInt()
  sortOrder!: number;
}
