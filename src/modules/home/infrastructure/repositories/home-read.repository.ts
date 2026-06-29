import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { buildMealLogHomeDetail } from '@modules/meal-logs/domain/utils/build-meal-log-home-detail.util';
import type { HomeRegisteredMealEntity } from '@modules/meal-logs/domain/entities/home-registered-meal.entity';
import type { HomeRecommendationEntity } from '@modules/recipes/domain/entities/home-recommendation.entity';
import { getLocalEntryDateDayRange } from '@modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util';
import { buildHomeRecommendationMeta } from '../../domain/utils/build-home-recommendation-meta.util';
import { resolveRecipeTotalDurationMinutes } from '@modules/recipes/domain/utils/resolve-recipe-total-duration-minutes.util';

const notDeleted = { deletedAt: null } as const;

const mealTypeSelect = {
  id: true,
  name: true,
  sortOrder: true,
} as const;

const homeRecommendationSelect = {
  id: true,
  title: true,
  coverUrl: true,
  tagLinks: {
    where: { tag: { deletedAt: null } },
    select: {
      tag: {
        select: { name: true },
      },
    },
  },
  steps: {
    select: { durationMinutes: true },
  },
} satisfies Prisma.RecipeSelect;

type HomeRecommendationRecord = Prisma.RecipeGetPayload<{
  select: typeof homeRecommendationSelect;
}>;

@Injectable()
export class HomeReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findRegisteredMeals(
    profileId: string,
    entryDate: string,
  ): Promise<HomeRegisteredMealEntity[]> {
    const { start, end } = getLocalEntryDateDayRange(entryDate);

    const records = await this.prisma.mealLog.findMany({
      where: {
        profileId,
        ...notDeleted,
        loggedAt: { gte: start, lt: end },
      },
      orderBy: { loggedAt: 'asc' },
      select: {
        id: true,
        mediaUrl: true,
        loggedAt: true,
        content: true,
        mealType: { select: mealTypeSelect },
        meal_log_recipes: {
          orderBy: { sort_order: 'asc' },
          select: {
            recipes: { select: { title: true } },
          },
        },
        scheduledMeal: {
          select: {
            isExpress: true,
            expressNote: true,
          },
        },
      },
    });

    return records.map((record) => ({
      id: record.id,
      mealTypeName: record.mealType?.name ?? 'Comida',
      loggedAt: record.loggedAt,
      detail: buildMealLogHomeDetail(record),
      mediaUrl: record.mediaUrl,
    }));
  }

  async findRecommendation(profileId: string): Promise<HomeRecommendationEntity | null> {
    const record: HomeRecommendationRecord | null = await this.prisma.recipe.findFirst({
      where: {
        ...notDeleted,
        isHomeRecommendation: true,
        NOT: {
          userRecipeInteractions: {
            some: { profileId, isHidden: true },
          },
        },
      },
      select: homeRecommendationSelect,
    });

    if (!record) {
      return null;
    }

    return this.toRecommendationEntity(record);
  }

  private toRecommendationEntity(record: HomeRecommendationRecord): HomeRecommendationEntity {
    const tagNames: string[] = record.tagLinks
      .map((link) => link.tag.name.trim())
      .filter((name) => name.length > 0);

    const totalDurationMinutes = resolveRecipeTotalDurationMinutes(
      record.steps.map((step) => step.durationMinutes),
    );

    return {
      id: record.id,
      title: record.title,
      meta: buildHomeRecommendationMeta(tagNames, totalDurationMinutes),
      imageUrl: record.coverUrl,
    };
  }
}
