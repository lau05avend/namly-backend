import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class OnboardingOptionDto {
  @IsUUID()
  id!: string;

  @IsString()
  label!: string;

  @IsOptional()
  @IsString()
  iconName!: string | null;

  @IsBoolean()
  isDefault!: boolean;

  @IsInt()
  @Min(0)
  sortOrder!: number;

  @IsOptional()
  @IsUUID()
  linkedTagId!: string | null;
}
