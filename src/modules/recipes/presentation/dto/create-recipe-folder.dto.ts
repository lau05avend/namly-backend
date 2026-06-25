import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Trim } from '@common/decorators/trim.decorator';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { SwaggerExamples } from '@/docs/swagger/swagger.examples';
import type { CreateRecipeFolderParams } from '../../domain/interfaces/create-recipe-folder-params.interface';

export class CreateRecipeFolderDto implements CreateRecipeFolderParams {
  @ApiProperty({
    description: 'Nombre de la carpeta',
    example: SwaggerExamples.text.folderName,
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({
    description: 'Color en formato hexadecimal',
    example: '#4CAF50',
  })
  @Trim()
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  colorHex?: string | null;
}
