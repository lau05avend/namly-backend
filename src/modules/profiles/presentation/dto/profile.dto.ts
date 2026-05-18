import { IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

export class ProfileDto {
  @IsUUID()
  id!: string;

  @IsOptional()
  @IsString()
  displayName!: string | null;

  @IsOptional()
  @IsUrl()
  avatarUrl!: string | null;
}
