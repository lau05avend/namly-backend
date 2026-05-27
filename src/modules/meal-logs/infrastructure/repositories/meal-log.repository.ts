import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import {
  formatEntryDate,
  formatFloatingLocalEntryDate,
  formatPlannedTime,
  getLocalEntryDateDayRange,
} from '@modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util';
import type { MealLogMealTypeEntity } from '../../domain/entities/meal-log-meal-type.entity';
import type { CreateMealLogCoreParams } from '../../domain/interfaces/create-meal-log-core-params.interface';
import type { UpdateMealLogCoreParams } from '../../domain/interfaces/update-meal-log-core-params.interface';

const notDeleted = { deletedAt: null } as const;

const mealTypeSelect = {
  id: true,
  name: true,
  sortOrder: true,
} as const;

const tagSelect = {
  id: true,
  category: true,
  name: true,
  iconName: true,
} as const;

const mealLogRecipeSelect = {
  orderBy: { sort_order: 'asc' as const },
  select: {
    id: true,
    recipe_id: true,
    sort_order: true,
    recipes: {
      select: {
        title: true,
        coverUrl: true,
      },
    },
  },
} as const;

export type MealLogHistoryRecord = {
  id: string;
  mediaUrl: string | null;
  loggedAt: Date;
  scheduledMealId: string | null;
  mealType: MealLogMealTypeEntity | null;
};

export type MealLogDetailRecord = {
  id: string;
  mediaUrl: string | null;
  content: string | null;
  score: number | null;
  loggedAt: Date;
  scheduledMealId: string | null;
  mealType: MealLogMealTypeEntity | null;
  meal_log_recipes: Array<{
    id: string;
    recipe_id: string;
    sort_order: number;
    recipes: { title: string; coverUrl: string | null };
  }>;
  tagLinks: Array<{
    tag: {
      id: string;
      category: string;
      name: string;
      iconName: string | null;
    };
  }>;
  scheduledMeal: {
    id: string;
    entryDate: Date;
    plannedTime: Date;
    isExpress: boolean;
    expressNote: string | null;
    mealType: MealLogMealTypeEntity;
    scheduledMealRecipes: Array<{
      id: string;
      recipeId: string;
      sortOrder: number;
      recipe: { title: string; coverUrl: string | null };
    }>;
  } | null;
};

@Injectable()
export class MealLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findHistoryByEntryDate(
    profileId: string,
    entryDate: string,
  ): Promise<MealLogHistoryRecord[]> {
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
        scheduledMealId: true,
        mealType: { select: mealTypeSelect },
      },
    });

    return records.map((record) => ({
      id: record.id,
      mediaUrl: record.mediaUrl,
      loggedAt: record.loggedAt,
      scheduledMealId: record.scheduledMealId,
      mealType: record.mealType,
    }));
  }

  async findDetailByIdForProfile(
    mealLogId: string,
    profileId: string,
  ): Promise<MealLogDetailRecord | null> {
    const record = await this.prisma.mealLog.findFirst({
      where: {
        id: mealLogId,
        profileId,
        ...notDeleted,
      },
      select: {
        id: true,
        mediaUrl: true,
        content: true,
        score: true,
        loggedAt: true,
        scheduledMealId: true,
        mealType: { select: mealTypeSelect },
        meal_log_recipes: mealLogRecipeSelect,
        tagLinks: {
          select: {
            tag: { select: tagSelect },
          },
        },
        scheduledMeal: {
          where: { ...notDeleted },
          select: {
            id: true,
            entryDate: true,
            plannedTime: true,
            isExpress: true,
            expressNote: true,
            mealType: { select: mealTypeSelect },
            scheduledMealRecipes: {
              orderBy: { sortOrder: 'asc' },
              select: {
                id: true,
                recipeId: true,
                sortOrder: true,
                recipe: { select: { title: true, coverUrl: true } },
              },
            },
          },
        },
      },
    });

    if (!record) {
      return null;
    }

    return {
      id: record.id,
      mediaUrl: record.mediaUrl,
      content: record.content,
      score: record.score,
      loggedAt: record.loggedAt,
      scheduledMealId: record.scheduledMealId,
      mealType: record.mealType,
      meal_log_recipes: record.meal_log_recipes.map((item) => ({
        id: item.id,
        recipe_id: item.recipe_id,
        sort_order: item.sort_order,
        recipes: item.recipes,
      })),
      tagLinks: record.tagLinks,
      scheduledMeal: record.scheduledMeal,
    };
  }

  async findDistinctLoggedDatesForMonth(
    profileId: string,
    year: number,
    month: number,
  ): Promise<string[]> {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    const records = await this.prisma.mealLog.findMany({
      where: {
        profileId,
        ...notDeleted,
        loggedAt: { gte: start, lte: end },
      },
      select: { loggedAt: true },
      orderBy: { loggedAt: 'asc' },
    });

    const uniqueDates = new Set<string>();

    for (const record of records) {
      uniqueDates.add(formatFloatingLocalEntryDate(record.loggedAt));
    }

    return [...uniqueDates].sort();
  }

  async isOwnedByProfile(mealLogId: string, profileId: string): Promise<boolean> {
    const count = await this.prisma.mealLog.count({
      where: {
        id: mealLogId,
        profileId,
        ...notDeleted,
      },
    });

    return count > 0;
  }

  async isOwnedByProfileInTransaction(
    tx: Prisma.TransactionClient,
    mealLogId: string,
    profileId: string,
  ): Promise<boolean> {
    const record = await tx.mealLog.findFirst({
      where: {
        id: mealLogId,
        profileId,
        ...notDeleted,
      },
      select: { id: true },
    });

    return record !== null;
  }

  async createRecord(
    tx: Prisma.TransactionClient,
    profileId: string,
    params: CreateMealLogCoreParams,
  ): Promise<string> {
    const record = await tx.mealLog.create({
      data: {
        profileId,
        scheduledMealId: params.scheduledMealId,
        mealTypeId: params.mealTypeId,
        mediaUrl: params.mediaUrl,
        content: params.content,
        score: params.score,
        loggedAt: params.loggedAt,
      },
      select: { id: true },
    });

    return record.id;
  }

  async updateRecord(
    tx: Prisma.TransactionClient,
    mealLogId: string,
    params: UpdateMealLogCoreParams,
  ): Promise<void> {
    await tx.mealLog.update({
      where: { id: mealLogId },
      data: {
        ...(params.scheduledMealId !== undefined && {
          scheduledMealId: params.scheduledMealId,
        }),
        ...(params.mealTypeId !== undefined && { mealTypeId: params.mealTypeId }),
        ...(params.mediaUrl !== undefined && { mediaUrl: params.mediaUrl }),
        ...(params.content !== undefined && { content: params.content }),
        ...(params.score !== undefined && { score: params.score }),
        ...(params.loggedAt !== undefined && { loggedAt: params.loggedAt }),
        updatedAt: new Date(),
      },
    });
  }

  async softDeleteWithLinks(
    tx: Prisma.TransactionClient,
    mealLogId: string,
    profileId: string,
  ): Promise<boolean> {
    await tx.mealLogTagLink.deleteMany({ where: { mealLogId } });
    await tx.meal_log_recipes.deleteMany({ where: { meal_log_id: mealLogId } });
    const result = await tx.mealLog.update({
      where: {
        id: mealLogId,
        profileId,
        ...notDeleted,
      },
      data: { deletedAt: new Date() },
      select: { id: true },
    });

    return result !== null;
  }

  formatScheduledMealPlannedTime(plannedTime: Date): string {
    return formatPlannedTime(plannedTime);
  }

  formatScheduledMealEntryDate(entryDate: Date): string {
    return formatEntryDate(entryDate);
  }
}
