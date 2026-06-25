import { ApiProperty } from '@nestjs/swagger';
import { Trim } from '@common/decorators/trim.decorator';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { SwaggerExamples } from '@/docs/swagger/swagger.examples';

export class TagsByCategoryQueryDto {
  @ApiProperty({
    description: 'Categoría de etiquetas (ej. recipes, meal_logs)',
    example: SwaggerExamples.text.tagCategoryRecipes,
  })
  @Trim()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(64)
  category!: string;
}
