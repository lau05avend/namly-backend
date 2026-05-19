import { Trim } from '@common/decorators/trim.decorator';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import type { CreateRecipeFolderParams } from '../../domain/interfaces/create-recipe-folder-params.interface';

export class CreateRecipeFolderDto implements CreateRecipeFolderParams {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @Trim()
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  colorHex?: string | null;
}
