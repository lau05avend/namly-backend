import { Trim } from '@common/decorators/trim.decorator';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import type { UpdateTagParams } from '../../domain/interfaces/update-tag-params.interface';

export class UpdateTagDto implements UpdateTagParams {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  category!: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name!: string;

  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(64)
  iconName?: string | null;
}
