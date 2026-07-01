import type { ScheduledMealEntity } from '../../domain/entities/scheduled-meal.entity';
import { ScheduledMealDto } from '../dto/scheduled-meal.dto';
import { ScheduledMealCompletionMealLogDto } from '../dto/scheduled-meal-completion-meal-log.dto';
import { ScheduledMealCompletionTagDto } from '../dto/scheduled-meal-completion-tag.dto';
import { ScheduledMealMealTypeDto } from '../dto/scheduled-meal-meal-type.dto';
import { ScheduledMealRecipeDto } from '../dto/scheduled-meal-recipe.dto';
import { ScheduledMealReminderDto } from '../dto/scheduled-meal-reminder.dto';

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
    dto.totalDurationMinutes = entity.totalDurationMinutes;
    dto.reminders = entity.reminders.map((reminder) => this.toReminderDto(reminder));

    if (entity.isExpress) {
      dto.expressNote = entity.expressNote;
      dto.recipes = undefined;
    } else {
      dto.expressNote = null;
      dto.recipes = entity.recipes.map((recipe) => this.toRecipeDto(recipe));
    }

    dto.completionMealLog = entity.completionMealLog
      ? this.toCompletionMealLogDto(entity.completionMealLog)
      : null;

    return dto;
  }

  static toDtoList(entities: readonly ScheduledMealEntity[]): ScheduledMealDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  private static toReminderDto(
    entity: ScheduledMealEntity['reminders'][number],
  ): ScheduledMealReminderDto {
    const dto = new ScheduledMealReminderDto();

    dto.id = entity.id;
    dto.offsetMinutes = entity.offsetMinutes;

    return dto;
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

  private static toCompletionMealLogDto(
    entity: NonNullable<ScheduledMealEntity['completionMealLog']>,
  ): ScheduledMealCompletionMealLogDto {
    const dto = new ScheduledMealCompletionMealLogDto();

    dto.id = entity.id;
    dto.mediaUrl = entity.mediaUrl;
    dto.loggedAt = entity.loggedAt;
    dto.content = entity.content;
    dto.tags = entity.tags.map((tag) => this.toCompletionTagDto(tag));

    return dto;
  }

  private static toCompletionTagDto(
    entity: NonNullable<ScheduledMealEntity['completionMealLog']>['tags'][number],
  ): ScheduledMealCompletionTagDto {
    const dto = new ScheduledMealCompletionTagDto();

    dto.id = entity.id;
    dto.category = entity.category;
    dto.name = entity.name;
    dto.iconName = entity.iconName;

    return dto;
  }
}
