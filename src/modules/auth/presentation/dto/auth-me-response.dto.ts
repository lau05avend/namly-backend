import { IsBoolean, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class AuthMeResponseDto {
  @IsUUID()
  id!: string;

  @IsOptional()
  @IsString()
  displayName!: string | null;

  @IsOptional()
  @IsUrl()
  avatarUrl!: string | null;

  @IsOptional()
  @IsString()
  email!: string | null;

  @IsBoolean()
  hasCompletedOnboarding!: boolean;

  @IsBoolean()
  isNewUser!: boolean;
}
