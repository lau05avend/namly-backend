import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class PlatformSettingsDto {
  @IsOptional()
  @IsUUID()
  weightUnitId!: string | null;

  @IsOptional()
  @IsUUID()
  volumeUnitId!: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  language!: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  theme!: string | null;
}
