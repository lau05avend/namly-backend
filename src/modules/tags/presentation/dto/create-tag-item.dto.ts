import { Trim } from '@common/decorators/trim.decorator';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import type { CreateTagItemParams } from '../../domain/interfaces/create-tag-item-params.interface';

export class CreateTagItemDto implements CreateTagItemParams {
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
