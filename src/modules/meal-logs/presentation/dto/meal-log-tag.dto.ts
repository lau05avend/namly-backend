import { IsOptional, IsString, IsUUID } from 'class-validator';

export class MealLogTagDto {
  @IsUUID()
  id!: string;

  @IsString()
  category!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  iconName!: string | null;
}
