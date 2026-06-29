import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class RecipeOriginDto {
  @IsOptional()
  @IsUUID()
  profileId!: string | null;

  @IsOptional()
  @IsString()
  profileDisplayName!: string | null;

  @IsBoolean()
  isSuggested!: boolean;
}
