import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { formatFloatingLocalEntryDate } from '@modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util';
import { RecipesService } from '@modules/recipes/application/recipes.service';
import {
  attachDurationMinutesToRecipeLinks,
  collectUniqueRecipeIds,
} from '@modules/recipes/domain/utils/attach-duration-minutes-to-recipe-links.util';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import type { MealLogDetailEntity } from '../domain/entities/meal-log-detail.entity';
import type { MealLogHistoryItemEntity } from '../domain/entities/meal-log-history-item.entity';
import type { CreateMealLogParams } from '../domain/interfaces/create-meal-log-params.interface';
import type { UpdateMealLogParams } from '../domain/interfaces/update-meal-log-params.interface';
import { MealLogRepository } from '../infrastructure/repositories/meal-log.repository';
import { toMealLogDetailEntity, toMealLogHistoryItemEntity } from './meal-log-entity.mapper';
import {
  MEAL_LOG_DELETED_EVENT,
  MealLogDeletedEvent,
} from '../domain/events/meal-log-deleted.event';
import { CreateMealLogUseCase } from './use-cases/create-meal-log.use-case';
import { UpdateMealLogUseCase } from './use-cases/update-meal-log.use-case';

@Injectable()
export class MealLogsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mealLogRepository: MealLogRepository,
    private readonly createMealLogUseCase: CreateMealLogUseCase,
    private readonly updateMealLogUseCase: UpdateMealLogUseCase,
    private readonly recipesService: RecipesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  create(profileId: string, params: CreateMealLogParams): Promise<MealLogDetailEntity> {
    return this.createMealLogUseCase.execute(profileId, params);
  }

  async listHistoryByDate(
    profileId: string,
    entryDate: string,
  ): Promise<MealLogHistoryItemEntity[]> {
    const records = await this.mealLogRepository.findHistoryByEntryDate(profileId, entryDate);

    return records.map((record) => toMealLogHistoryItemEntity(record));
  }

  async getById(mealLogId: string, profileId: string): Promise<MealLogDetailEntity> {
    const record = await this.mealLogRepository.findDetailByIdForProfile(mealLogId, profileId);

    if (!record) {
      throw new NotFoundException('Meal log not found');
    }

    return this.enrichMealLogDetailWithRecipeDurations(
      toMealLogDetailEntity(record, this.mealLogRepository),
    );
  }

  private async enrichMealLogDetailWithRecipeDurations(
    entity: MealLogDetailEntity,
  ): Promise<MealLogDetailEntity> {
    const recipeIds = collectUniqueRecipeIds(
      entity.recipes,
      entity.scheduledMeal?.recipes ?? [],
    );

    if (recipeIds.length === 0) {
      return entity;
    }

    const durationMinutesByRecipeId =
      await this.recipesService.findTotalDurationMinutesByRecipeIds(recipeIds);

    return {
      ...entity,
      recipes: attachDurationMinutesToRecipeLinks(entity.recipes, durationMinutesByRecipeId),
      scheduledMeal: entity.scheduledMeal
        ? {
            ...entity.scheduledMeal,
            recipes: attachDurationMinutesToRecipeLinks(
              entity.scheduledMeal.recipes,
              durationMinutesByRecipeId,
            ),
          }
        : null,
    };
  }

  async update(
    mealLogId: string,
    profileId: string,
    params: UpdateMealLogParams,
  ): Promise<MealLogDetailEntity> {
    const updated = await this.updateMealLogUseCase.execute(mealLogId, profileId, params);

    if (!updated) {
      throw new NotFoundException('Meal log not found');
    }

    return updated;
  }

  async delete(mealLogId: string, profileId: string): Promise<void> {
    const loggedAt = await this.mealLogRepository.findLoggedAtForProfile(mealLogId, profileId);

    if (!loggedAt) {
      throw new NotFoundException('Meal log not found');
    }

    const deleted = await this.prisma.$transaction(async (tx) => {
      const owned = await this.mealLogRepository.isOwnedByProfileInTransaction(
        tx,
        mealLogId,
        profileId,
      );

      if (!owned) {
        return false;
      }

      return this.mealLogRepository.softDeleteWithLinks(tx, mealLogId, profileId);
    });

    if (!deleted) {
      throw new NotFoundException('Meal log not found');
    }

    const entryDate = formatFloatingLocalEntryDate(loggedAt); // TODO: Estandarizar si ese parseo se hace aca o en el event
    this.eventEmitter.emit(
      MEAL_LOG_DELETED_EVENT,
      new MealLogDeletedEvent(profileId, mealLogId, entryDate),
    );
  }

  async getCalendarDays(
    profileId: string,
    year: number,
    month: number,
  ): Promise<readonly string[]> {
    if (month < 1 || month > 12) {
      throw new BadRequestException('month must be between 1 and 12');
    }

    return this.mealLogRepository.findDistinctLoggedDatesForMonth(profileId, year, month);
  }

  async countByProfileAndEntryDate(profileId: string, entryDate: string): Promise<number> {
    return this.mealLogRepository.countByProfileAndEntryDate(profileId, entryDate);
  }
}
