import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import {
  DEFAULT_FREQUENT_MEAL_TYPES_LIMIT,
  MAX_FREQUENT_MEAL_TYPES_LIMIT,
} from '../../domain/constants/meal-type-list.constants';
import {
  MEAL_TYPE_LIST_VIEWS,
  type MealTypeListView,
} from '../../domain/enums/meal-type-list-view.enum';

export class ListMealTypesQueryDto {
  @ApiPropertyOptional({
    description:
      'Vista del listado: `all` devuelve todos con flag isFrequent; `frequent` devuelve solo el top N habitual',
    enum: MEAL_TYPE_LIST_VIEWS,
    default: 'all',
  })
  @IsOptional()
  @IsIn(MEAL_TYPE_LIST_VIEWS)
  view: MealTypeListView = 'all';

  @ApiPropertyOptional({
    description: 'Cantidad de tipos considerados frecuentes (top N por uso)',
    default: DEFAULT_FREQUENT_MEAL_TYPES_LIMIT,
    minimum: 1,
    maximum: MAX_FREQUENT_MEAL_TYPES_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_FREQUENT_MEAL_TYPES_LIMIT)
  limit: number = DEFAULT_FREQUENT_MEAL_TYPES_LIMIT;
}
