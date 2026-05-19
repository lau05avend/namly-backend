import { IsArray, IsIn, IsOptional, IsUUID } from 'class-validator';
import {
  RECIPE_LIST_FILTERS,
  type RecipeListFilter,
} from '../../domain/enums/recipe-list-filter.enum';

export class ListRecipesQueryDto {
  @IsIn(RECIPE_LIST_FILTERS)
  filter: RecipeListFilter = 'all';

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tags?: string[];
}
