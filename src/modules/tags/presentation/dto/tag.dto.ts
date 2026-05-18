import { IsOptional, IsString, IsUUID } from 'class-validator';

export class TagDto {
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
