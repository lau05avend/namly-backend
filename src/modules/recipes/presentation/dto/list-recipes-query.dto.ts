import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsOptional, IsUUID } from 'class-validator';
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
  @IsIn(RECIPE_LIST_FILTERS)
  filter: RecipeListFilter = 'all';

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => parseCsvUuids(value))
  @IsArray()
  @IsUUID('4', { each: true })
  tags?: string[];

  @IsOptional()
  @IsUUID()
  folderId?: string;
}
