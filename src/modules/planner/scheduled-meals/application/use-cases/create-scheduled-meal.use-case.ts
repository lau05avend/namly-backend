import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { MealTypesService } from '@modules/meal-types/application/meal-types.service';
import { RecipeAccessService } from '@modules/recipes/application/recipe-access.service';
import type { ScheduledMealEntity } from '../../domain/entities/scheduled-meal.entity';
import type { CreateScheduledMealParams } from '../../domain/interfaces/create-scheduled-meal-params.interface';
import { parseEntryDate, parsePlannedTime } from '../../domain/utils/scheduled-meal-datetime.util';
import { ScheduledMealRecipeRepository } from '../../infrastructure/repositories/scheduled-meal-recipe.repository';
import { ScheduledMealRepository } from '../../infrastructure/repositories/scheduled-meal.repository';
import { PlannerStatusService } from '../planner-status.service';
import { toScheduledMealEntity } from '../scheduled-meal-entity.mapper';

@Injectable()
export class CreateScheduledMealUseCase {
  private readonly logger = new Logger(CreateScheduledMealUseCase.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly scheduledMealRepository: ScheduledMealRepository,
    private readonly scheduledMealRecipeRepository: ScheduledMealRecipeRepository,
    private readonly mealTypesService: MealTypesService,
    private readonly recipeAccessService: RecipeAccessService,
    private readonly plannerStatusService: PlannerStatusService,
  ) {}

  async execute(
    profileId: string,
    params: CreateScheduledMealParams,
  ): Promise<ScheduledMealEntity> {
    await this.mealTypesService.assertAccessibleForProfile(profileId, params.mealTypeId);

    if (!params.isExpress && params.recipeIds) {
      await this.recipeAccessService.assertRecipesAccessible(profileId, params.recipeIds);
    }

    const scheduledMealId = await this.prisma.$transaction(async (tx) => {
      const id = await this.scheduledMealRepository.createRecord(tx, profileId, {
        mealTypeId: params.mealTypeId,
        entryDate: parseEntryDate(params.entryDate),
        plannedTime: parsePlannedTime(params.plannedTime),
        isExpress: params.isExpress,
        expressNote: params.isExpress ? (params.expressNote ?? null) : null,
      });

      if (!params.isExpress && params.recipeIds) {
        await this.scheduledMealRecipeRepository.createMany(tx, id, params.recipeIds);
      }

      return id;
    });

    const record = await this.scheduledMealRepository.findByIdForProfile(
      scheduledMealId,
      profileId,
    );

    if (!record) {
      this.logger.error(
        `Scheduled meal ${scheduledMealId} was created but could not be loaded for profile ${profileId}`,
      );
      throw new InternalServerErrorException('Scheduled meal was created but could not be loaded');
    }

    const statuses = await this.plannerStatusService.resolveStatusesForMeal(profileId, record);

    return toScheduledMealEntity(
      record,
      statuses.get(record.id) ?? 'upcoming',
      this.scheduledMealRepository,
    );
  }
}
