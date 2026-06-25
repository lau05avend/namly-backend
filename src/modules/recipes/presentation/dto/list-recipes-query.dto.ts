import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import { Trim } from '@common/decorators/trim.decorator';
import { SwaggerExamples } from '@/docs/swagger/swagger.examples';
import {
  RECIPE_LIST_FILTERS,
  type RecipeListFilter,
} from '../../domain/enums/recipe-list-filter.enum';

function parseCsvUuids(value: unknown): string[] | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export class ListRecipesQueryDto {
  @ApiProperty({
    description: 'Filtro de listado',
    enum: RECIPE_LIST_FILTERS,
    example: 'all',
  })
  @IsIn(RECIPE_LIST_FILTERS)
  filter: RecipeListFilter = 'all';

  @ApiPropertyOptional({
    description: 'IDs de etiquetas separados por coma',
    example: SwaggerExamples.uuid.tagVegetariano,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => parseCsvUuids(value))
  @IsArray()
  @IsUUID('4', { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Filtrar recetas dentro de una carpeta',
    example: SwaggerExamples.uuid.recipeFolder,
  })
  @IsOptional()
  @IsUUID()
  folderId?: string;

  @ApiPropertyOptional({
    description: 'Búsqueda parcial por título',
    example: 'quesadilla',
  })
  @IsOptional()
  @IsString()
  @Trim()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' && value.length === 0 ? undefined : value,
  )
  title?: string;
}
