import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { MealTypesService } from '@modules/meal-types/application/meal-types.service';
import { RecipeAccessService } from '@modules/recipes/application/recipe-access.service';
import type { ScheduledMealEntity } from '../../domain/entities/scheduled-meal.entity';
import type { UpdateScheduledMealParams } from '../../domain/interfaces/update-scheduled-meal-params.interface';
import {
  formatEntryDate,
  parseEntryDate,
  parsePlannedTime,
} from '../../domain/utils/scheduled-meal-datetime.util';
import {
  SCHEDULED_MEAL_UPDATED_EVENT,
  ScheduledMealUpdatedEvent,
} from '../../domain/events/scheduled-meal-updated.event';
import { getMealFlowValidationError } from '../../domain/utils/scheduled-meal-flow.util';
import { ScheduledMealRecipeRepository } from '../../infrastructure/repositories/scheduled-meal-recipe.repository';
import { ScheduledMealRepository } from '../../infrastructure/repositories/scheduled-meal.repository';
import { PlannerStatusService } from '../planner-status.service';
import { toScheduledMealEntity } from '../scheduled-meal-entity.mapper';

@Injectable()
export class UpdateScheduledMealUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduledMealRepository: ScheduledMealRepository,
    private readonly scheduledMealRecipeRepository: ScheduledMealRecipeRepository,
    private readonly mealTypesService: MealTypesService,
    private readonly recipeAccessService: RecipeAccessService,
    private readonly plannerStatusService: PlannerStatusService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    scheduledMealId: string,
    profileId: string,
    params: UpdateScheduledMealParams,
  ): Promise<ScheduledMealEntity | null> {
    const existing = await this.scheduledMealRepository.findByIdForProfile(
      scheduledMealId,
      profileId,
    );

    if (!existing) {
      return null;
    }

    const isExpress = params.isExpress === true;
    const expressNote = isExpress ? (params.expressNote ?? existing.expressNote) : null;
    const recipeIds = isExpress
      ? undefined
      : (params.recipeIds ?? existing.scheduledMealRecipes.map((item) => item.recipeId));

    const validationError = getMealFlowValidationError(isExpress, expressNote, recipeIds);

    if (validationError) {
      throw new BadRequestException(validationError);
    }

    if (params.mealTypeId !== undefined) {
      await this.mealTypesService.assertAccessibleForProfile(profileId, params.mealTypeId);
    }

    if (!isExpress && params.recipeIds !== undefined) {
      await this.recipeAccessService.assertRecipesAccessible(profileId, params.recipeIds);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const core = await this.scheduledMealRepository.findCoreForProfileInTransaction(
        tx,
        scheduledMealId,
        profileId,
      );

      if (!core) {
        return false;
      }

      await this.scheduledMealRepository.updateRecord(tx, scheduledMealId, {
        ...(params.mealTypeId && { mealTypeId: params.mealTypeId }),
        ...(params.entryDate && { entryDate: parseEntryDate(params.entryDate) }),
        ...(params.plannedTime && {
          plannedTime: parsePlannedTime(params.plannedTime),
        }),
        isExpress,
        expressNote,
      });

      if (isExpress) {
        await this.scheduledMealRecipeRepository.deleteAllForScheduledMeal(tx, scheduledMealId);
      } else if (params.recipeIds !== undefined) {
        await this.scheduledMealRecipeRepository.sync(tx, scheduledMealId, params.recipeIds);
      }

      return true;
    });

    if (!updated) {
      return null;
    }

    const record = await this.scheduledMealRepository.findByIdForProfile(
      scheduledMealId,
      profileId,
    );

    if (!record) {
      return null;
    }

    const statuses = await this.plannerStatusService.resolveStatusesForMeal(profileId, record);

    const entryDate = formatEntryDate(record.entryDate);
    const previousEntryDate = params.entryDate ? formatEntryDate(existing.entryDate) : undefined;

    this.eventEmitter.emit(
      SCHEDULED_MEAL_UPDATED_EVENT,
      new ScheduledMealUpdatedEvent(profileId, scheduledMealId, entryDate, previousEntryDate),
    );

    return toScheduledMealEntity(
      record,
      statuses.get(record.id) ?? 'upcoming',
      this.scheduledMealRepository,
    );
  }
}
