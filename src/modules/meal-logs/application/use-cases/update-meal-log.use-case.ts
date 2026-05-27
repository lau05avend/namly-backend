import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { MealTypesService } from '@modules/meal-types/application/meal-types.service';
import { ScheduledMealsService } from '@modules/planner/scheduled-meals/application/scheduled-meals.service';
import { RecipeAccessService } from '@modules/recipes/application/recipe-access.service';
import { TagsService } from '@modules/tags/application/tags.service';
import type { MealLogDetailEntity } from '../../domain/entities/meal-log-detail.entity';
import { MEAL_LOG_MAX_RECIPES } from '../../domain/constants/meal-log.constants';
import type { UpdateMealLogParams } from '../../domain/interfaces/update-meal-log-params.interface';
import { MealLogRecipeRepository } from '../../infrastructure/repositories/meal-log-recipe.repository';
import { MealLogRepository } from '../../infrastructure/repositories/meal-log.repository';
import { MealLogTagLinkRepository } from '../../infrastructure/repositories/meal-log-tag-link.repository';
import { toMealLogDetailEntity } from '../meal-log-entity.mapper';

@Injectable()
export class UpdateMealLogUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mealLogRepository: MealLogRepository,
    private readonly mealLogRecipeRepository: MealLogRecipeRepository,
    private readonly mealLogTagLinkRepository: MealLogTagLinkRepository,
    private readonly scheduledMealsService: ScheduledMealsService,
    private readonly mealTypesService: MealTypesService,
    private readonly recipeAccessService: RecipeAccessService,
    private readonly tagsService: TagsService,
  ) {}

  async execute(
    mealLogId: string,
    profileId: string,
    params: UpdateMealLogParams,
  ): Promise<MealLogDetailEntity | null> {
    const owned = await this.mealLogRepository.isOwnedByProfile(mealLogId, profileId);

    if (!owned) {
      return null;
    }

    if (params.scheduledMealId) {
      await this.scheduledMealsService.assertLinkableForMealLog(
        profileId,
        params.scheduledMealId,
        mealLogId,
      );
    }

    if (params.mealTypeId) {
      await this.mealTypesService.assertAccessibleForProfile(profileId, params.mealTypeId);
    }

    if (params.tagIds !== undefined) {
      await this.tagsService.assertTagsAccessible(profileId, params.tagIds);
    }

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

    const updated = await this.prisma.$transaction(async (tx) => {
      const exists = await this.mealLogRepository.isOwnedByProfileInTransaction(
        tx,
        mealLogId,
        profileId,
      );

      if (!exists) {
        return false;
      }

      await this.mealLogRepository.updateRecord(tx, mealLogId, {
        ...(params.scheduledMealId !== undefined && {
          scheduledMealId: params.scheduledMealId,
        }),
        ...(params.mealTypeId !== undefined && { mealTypeId: params.mealTypeId }),
        ...(params.mediaUrl !== undefined && { mediaUrl: params.mediaUrl }),
        ...(params.content !== undefined && { content: params.content }),
        ...(params.score !== undefined && { score: params.score }),
        ...(params.loggedAt !== undefined && { loggedAt: params.loggedAt }),
      });

      if (params.tagIds !== undefined) {
        await this.mealLogTagLinkRepository.sync(tx, mealLogId, params.tagIds);
      }

      if (params.recipeIds && params.recipeIds.length > 0) {
        await this.mealLogRecipeRepository.sync(tx, mealLogId, params.recipeIds);
      }

      return true;
    });

    if (!updated) {
      return null;
    }

    const record = await this.mealLogRepository.findDetailByIdForProfile(mealLogId, profileId);

    if (!record) {
      return null;
    }

    return toMealLogDetailEntity(record, this.mealLogRepository);
  }
}
