import { IsBoolean, IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class RecipeListItemDto {
  @IsUUID()
  id!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  coverUrl!: string | null;

  @IsOptional()
  rating!: number | null;

  @IsBoolean()
  isFavorite!: boolean;

  @IsBoolean()
  isHidden!: boolean;

  @IsBoolean()
  isSuggested!: boolean;

  @IsBoolean()
  isPublic!: boolean;

  @IsDate()
  updatedAt!: Date;

  @IsDate()
  createdAt!: Date;
}
