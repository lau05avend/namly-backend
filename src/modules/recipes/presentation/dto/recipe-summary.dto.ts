import { IsBoolean, IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class RecipeSummaryDto {
  @IsUUID()
  id!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description!: string | null;

  @IsOptional()
  @IsString()
  coverUrl!: string | null;

  @IsOptional()
  durationMinutes!: number | null;

  @IsBoolean()
  isPublic!: boolean;

  @IsDate()
  createdAt!: Date;

  @IsDate()
  updatedAt!: Date;
}
