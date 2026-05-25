import type { ScheduledMealEntity } from '../../domain/entities/scheduled-meal.entity';
import { ScheduledMealDto } from '../dto/scheduled-meal.dto';
import { ScheduledMealMealTypeDto } from '../dto/scheduled-meal-meal-type.dto';
import { ScheduledMealRecipeDto } from '../dto/scheduled-meal-recipe.dto';

export class ScheduledMealMapper {
  static toDto(entity: ScheduledMealEntity): ScheduledMealDto {
    const dto = new ScheduledMealDto();

    dto.id = entity.id;
    dto.mealTypeId = entity.mealTypeId;
    dto.mealType = this.toMealTypeDto(entity);
    dto.entryDate = entity.entryDate;
    dto.plannedTime = entity.plannedTime;
    dto.isExpress = entity.isExpress;
    dto.status = entity.status;

    if (entity.isExpress) {
      dto.expressNote = entity.expressNote;
      dto.recipes = undefined;
    } else {
      dto.expressNote = null;
      dto.recipes = entity.recipes.map((recipe) => this.toRecipeDto(recipe));
    }

    return dto;
  }

  static toDtoList(entities: readonly ScheduledMealEntity[]): ScheduledMealDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  private static toMealTypeDto(entity: ScheduledMealEntity): ScheduledMealMealTypeDto {
    const dto = new ScheduledMealMealTypeDto();

    dto.id = entity.mealType.id;
    dto.name = entity.mealType.name;
    dto.sortOrder = entity.mealType.sortOrder;

    return dto;
  }

  private static toRecipeDto(
    entity: ScheduledMealEntity['recipes'][number],
  ): ScheduledMealRecipeDto {
    const dto = new ScheduledMealRecipeDto();

    dto.id = entity.id;
    dto.recipeId = entity.recipeId;
    dto.title = entity.title;
    dto.coverUrl = entity.coverUrl;
    dto.sortOrder = entity.sortOrder;

    return dto;
  }
}
