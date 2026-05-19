import { Trim } from '@common/decorators/trim.decorator';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import type { UpdateRecipeFolderParams } from '../../domain/interfaces/update-recipe-folder-params.interface';

export class UpdateRecipeFolderDto implements UpdateRecipeFolderParams {
  @Trim()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @Trim()
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  colorHex?: string | null;
}
