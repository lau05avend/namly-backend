import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { MealTypesService } from '@modules/meal-types/application/meal-types.service';
import { ScheduledMealsService } from '@modules/planner/scheduled-meals/application/scheduled-meals.service';
import { RecipeAccessService } from '@modules/recipes/application/recipe-access.service';
import { TagsService } from '@modules/tags/application/tags.service';
import type { MealLogDetailEntity } from '../../domain/entities/meal-log-detail.entity';
import { MEAL_LOG_MAX_RECIPES } from '../../domain/constants/meal-log.constants';
import type { CreateMealLogParams } from '../../domain/interfaces/create-meal-log-params.interface';
import { MealLogRecipeRepository } from '../../infrastructure/repositories/meal-log-recipe.repository';
import { MealLogRepository } from '../../infrastructure/repositories/meal-log.repository';
import { MealLogTagLinkRepository } from '../../infrastructure/repositories/meal-log-tag-link.repository';
import {
  MEAL_LOG_CREATED_EVENT,
  MealLogCreatedEvent,
} from '../../domain/events/meal-log-created.event';
import { toMealLogDetailEntity } from '../meal-log-entity.mapper';

@Injectable()
export class CreateMealLogUseCase {
  private readonly logger = new Logger(CreateMealLogUseCase.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mealLogRepository: MealLogRepository,
    private readonly mealLogRecipeRepository: MealLogRecipeRepository,
    private readonly mealLogTagLinkRepository: MealLogTagLinkRepository,
    private readonly scheduledMealsService: ScheduledMealsService,
    private readonly mealTypesService: MealTypesService,
    private readonly recipeAccessService: RecipeAccessService,
    private readonly tagsService: TagsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(profileId: string, params: CreateMealLogParams): Promise<MealLogDetailEntity> {
    if (params.scheduledMealId) {
      await this.scheduledMealsService.assertLinkableForMealLog(profileId, params.scheduledMealId);
    }

    if (params.mealTypeId) {
      await this.mealTypesService.assertAccessibleForProfile(profileId, params.mealTypeId);
    }

    const tagIds = params.tagIds ?? [];
    await this.tagsService.assertTagsAccessible(profileId, tagIds);

    if (params.recipeIds && params.recipeIds.length !== new Set(params.recipeIds).size) {
      throw new BadRequestException('Duplicate recipe IDs in request');
    }

    if (params.recipeIds && params.recipeIds.length > MEAL_LOG_MAX_RECIPES) {
      throw new BadRequestException(
        `A meal log can include at most ${MEAL_LOG_MAX_RECIPES} recipes`,
      );
    }

    if (params.recipeIds && params.recipeIds.length > 0) {
      await this.recipeAccessService.assertRecipesAccessible(profileId, params.recipeIds);
    }

    const mealLogId = await this.prisma.$transaction(async (tx) => {
      const id = await this.mealLogRepository.createRecord(tx, profileId, {
        scheduledMealId: params.scheduledMealId ?? null,
        mealTypeId: params.mealTypeId ?? null,
        mediaUrl: params.mediaUrl,
        content: params.content ?? null,
        score: params.score ?? null,
        loggedAt: params.loggedAt,
      });

      if (tagIds.length > 0) {
        await this.mealLogTagLinkRepository.createMany(tx, id, tagIds);
      }

      if (params.recipeIds && params.recipeIds.length > 0) {
        await this.mealLogRecipeRepository.createMany(tx, id, params.recipeIds);
      }

      return id;
    });

    const record = await this.mealLogRepository.findDetailByIdForProfile(mealLogId, profileId);

    if (!record) {
      this.logger.error(
        `Meal log ${mealLogId} was created but could not be loaded for profile ${profileId}`,
      );
      throw new InternalServerErrorException('Meal log was created but could not be loaded');
    }

    this.eventEmitter.emit(
      MEAL_LOG_CREATED_EVENT,
      new MealLogCreatedEvent(profileId, mealLogId, record.loggedAt),
    );

    return toMealLogDetailEntity(record, this.mealLogRepository);
  }
}
