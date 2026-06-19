import type { ScheduledMealSuggestionEntity } from '../../domain/entities/scheduled-meal-suggestion.entity';
import { ScheduledMealSuggestionDto } from '../dto/scheduled-meal-suggestion.dto';
import { ScheduledMealMealTypeDto } from '../dto/scheduled-meal-meal-type.dto';
import { ScheduledMealRecipeDto } from '../dto/scheduled-meal-recipe.dto';

export class ScheduledMealSuggestionMapper {
  static toDto(entity: ScheduledMealSuggestionEntity): ScheduledMealSuggestionDto {
    const dto = new ScheduledMealSuggestionDto();

    dto.id = entity.id;
    dto.plannedTime = entity.plannedTime;
    dto.mealType = this.toMealTypeDto(entity);
    dto.recipes = entity.recipes.map((recipe) => this.toRecipeDto(recipe));
    dto.isExpress = entity.isExpress;
    dto.expressNote = entity.expressNote;

    return dto;
  }

  static toDtoList(
    entities: readonly ScheduledMealSuggestionEntity[],
  ): ScheduledMealSuggestionDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  private static toMealTypeDto(entity: ScheduledMealSuggestionEntity): ScheduledMealMealTypeDto {
    const dto = new ScheduledMealMealTypeDto();

    dto.id = entity.mealType.id;
    dto.name = entity.mealType.name;
    dto.sortOrder = entity.mealType.sortOrder;

    return dto;
  }

  private static toRecipeDto(
    entity: ScheduledMealSuggestionEntity['recipes'][number],
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
