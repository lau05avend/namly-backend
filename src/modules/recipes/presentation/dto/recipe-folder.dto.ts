import { IsDate, IsInt, IsString, IsUUID, Min } from 'class-validator';

export class RecipeFolderDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsString()
  colorHex!: string | null;

  @IsInt()
  @Min(0)
  recipesCount!: number;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}
