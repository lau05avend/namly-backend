import type { MealLogDetailEntity } from '../../domain/entities/meal-log-detail.entity';
import type { MealLogHistoryItemEntity } from '../../domain/entities/meal-log-history-item.entity';
import type { MealLogMealTypeEntity } from '../../domain/entities/meal-log-meal-type.entity';
import { MealLogDetailDto } from '../dto/meal-log-detail.dto';
import { MealLogHistoryItemDto } from '../dto/meal-log-history-item.dto';
import { MealLogMealTypeDto } from '../dto/meal-log-meal-type.dto';
import { MealLogRecipeDto } from '../dto/meal-log-recipe.dto';
import { MealLogScheduledMealDto } from '../dto/meal-log-scheduled-meal.dto';
import { MealLogTagDto } from '../dto/meal-log-tag.dto';

export class MealLogMapper {
  static toHistoryItemDto(entity: MealLogHistoryItemEntity): MealLogHistoryItemDto {
    const dto = new MealLogHistoryItemDto();

    dto.id = entity.id;
    dto.mediaUrl = entity.mediaUrl;
    dto.loggedAt = entity.loggedAt;
    dto.loggedAtTime = entity.loggedAtTime;
    dto.mealType = entity.mealType ? this.toMealTypeDto(entity.mealType) : null;
    dto.isLinkedToPlan = entity.isLinkedToPlan;

    return dto;
  }

  static toHistoryItemDtoList(
    entities: readonly MealLogHistoryItemEntity[],
  ): MealLogHistoryItemDto[] {
    return entities.map((entity) => this.toHistoryItemDto(entity));
  }

  static toDetailDto(entity: MealLogDetailEntity): MealLogDetailDto {
    const dto = new MealLogDetailDto();

    dto.id = entity.id;
    dto.mediaUrl = entity.mediaUrl;
    dto.content = entity.content;
    dto.score = entity.score;
    dto.loggedAt = entity.loggedAt;
    dto.mealType = entity.mealType ? this.toMealTypeDto(entity.mealType) : null;
    dto.scheduledMeal = entity.scheduledMeal ? this.toScheduledMealDto(entity.scheduledMeal) : null;
    dto.recipes = entity.recipes.map((recipe) => this.toRecipeDto(recipe));
    dto.tags = entity.tags.map((tag) => this.toTagDto(tag));
    dto.totalDurationMinutes = entity.totalDurationMinutes;

    return dto;
  }

  private static toMealTypeDto(entity: MealLogMealTypeEntity): MealLogMealTypeDto {
    const dto = new MealLogMealTypeDto();

    dto.id = entity.id;
    dto.name = entity.name;
    dto.sortOrder = entity.sortOrder;

    return dto;
  }

  private static toScheduledMealDto(
    entity: NonNullable<MealLogDetailEntity['scheduledMeal']>,
  ): MealLogScheduledMealDto {
    const dto = new MealLogScheduledMealDto();

    dto.id = entity.id;
    dto.entryDate = entity.entryDate;
    dto.plannedTime = entity.plannedTime;
    dto.isExpress = entity.isExpress;
    dto.expressNote = entity.expressNote;
    dto.mealType = this.toMealTypeDto(entity.mealType);
    dto.recipes = entity.recipes.map((recipe) => this.toRecipeDto(recipe));
    dto.totalDurationMinutes = entity.totalDurationMinutes;

    return dto;
  }

  private static toRecipeDto(entity: MealLogDetailEntity['recipes'][number]): MealLogRecipeDto {
    const dto = new MealLogRecipeDto();

    dto.id = entity.id;
    dto.recipeId = entity.recipeId;
    dto.title = entity.title;
    dto.coverUrl = entity.coverUrl;
    dto.durationMinutes = entity.durationMinutes;
    dto.sortOrder = entity.sortOrder;

    return dto;
  }

  private static toTagDto(entity: MealLogDetailEntity['tags'][number]): MealLogTagDto {
    const dto = new MealLogTagDto();

    dto.id = entity.id;
    dto.category = entity.category;
    dto.name = entity.name;
    dto.iconName = entity.iconName;

    return dto;
  }
}
