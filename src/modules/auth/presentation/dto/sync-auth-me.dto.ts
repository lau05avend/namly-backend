import { IsOptional, IsString } from 'class-validator';
import { Trim } from '@common/decorators/trim.decorator';

export class SyncAuthMeDto {
  @IsOptional()
  @IsString()
  @Trim()
  displayName?: string;
}
