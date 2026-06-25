import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';
import { SwaggerExamples } from '@/docs/swagger/swagger.examples';

export class FolderRecipesDto {
  @ApiProperty({
    description: 'IDs de recetas a agregar o quitar',
    example: [SwaggerExamples.uuid.recipe],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  recipeIds!: string[];
}
