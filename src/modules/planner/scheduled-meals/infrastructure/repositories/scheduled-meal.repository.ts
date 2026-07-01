import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { scheduledMealReminderSelect } from '@modules/planner/reminders/infrastructure/repositories/scheduled-meal-reminder.repository';
import type { ScheduledMealRecipeEntity } from '../../domain/entities/scheduled-meal-recipe.entity';
import type { ScheduledMealMealTypeEntity } from '../../domain/entities/scheduled-meal-meal-type.entity';
import type { CreateScheduledMealCoreParams } from '../../domain/interfaces/create-scheduled-meal-core-params.interface';
import type { UpdateScheduledMealCoreParams } from '../../domain/interfaces/update-scheduled-meal-core-params.interface';
import { formatEntryDate, parseEntryDate } from '../../domain/utils/scheduled-meal-datetime.util';

const notDeleted = { deletedAt: null } as const;

const mealTypeSelect = {
  id: true,
  name: true,
  sortOrder: true,
} as const;

const mealLogExistsSelect = (profileId: string) =>
  ({
    where: { ...notDeleted, profileId },
    take: 1,
    select: { id: true },
  }) as const;

const mealLogTagSelect = {
  id: true,
  category: true,
  name: true,
  iconName: true,
} as const;

const mealLogCompletionSelect = (profileId: string) =>
  ({
    where: { ...notDeleted, profileId },
    orderBy: { loggedAt: 'desc' as const },
    take: 1,
    select: {
      id: true,
      mediaUrl: true,
      loggedAt: true,
      content: true,
      tagLinks: {
        where: { tag: { deletedAt: null } },
        select: {
          tag: { select: mealLogTagSelect },
        },
      },
    },
  }) as const;

const recipeSelect = {
  orderBy: { sortOrder: 'asc' as const },
  select: {
    id: true,
    recipeId: true,
    sortOrder: true,
    recipe: {
      select: {
        title: true,
        coverUrl: true,
      },
    },
  },
} as const;

export type ScheduledMealCoreRecord = {
  id: string;
};

export type ScheduledMealRecord = {
  id: string;
  mealTypeId: string;
  entryDate: Date;
  plannedTime: Date;
  isExpress: boolean;
  expressNote: string | null;
  mealType: ScheduledMealMealTypeEntity;
  scheduledMealRecipes: Array<{
    id: string;
    recipeId: string;
    sortOrder: number;
    recipe: { title: string; coverUrl: string | null };
  }>;
  scheduledMealReminders: Array<{ id: string; offsetMinutes: number }>;
  mealLogs: Array<{ id: string }>;
};

export type ScheduledMealCompletionRecord = {
  id: string;
  mediaUrl: string | null;
  loggedAt: Date;
  content: string | null;
  tagLinks: Array<{
    tag: {
      id: string;
      category: string;
      name: string;
      iconName: string | null;
    };
  }>;
};

export type ScheduledMealDetailRecord = Omit<ScheduledMealRecord, 'mealLogs'> & {
  mealLogs: ScheduledMealCompletionRecord[];
};

@Injectable()
export class ScheduledMealRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProfileAndDate(profileId: string, entryDate: string): Promise<ScheduledMealRecord[]> {
    const records = await this.prisma.scheduledMeal.findMany({
      where: {
        profileId,
        ...notDeleted,
        entryDate: parseEntryDate(entryDate),
      },
      orderBy: { plannedTime: 'asc' },
      select: this.recordSelect(profileId),
    });

    return records.map((record) => this.toRecord(record));
  }

  async findDetailByIdForProfile(
    scheduledMealId: string,
    profileId: string,
  ): Promise<ScheduledMealDetailRecord | null> {
    const record = await this.prisma.scheduledMeal.findFirst({
      where: {
        id: scheduledMealId,
        profileId,
        ...notDeleted,
      },
      select: this.recordDetailSelect(profileId),
    });

    if (!record) {
      return null;
    }

    return this.toDetailRecord(record);
  }

  async findByIdForProfile(
    scheduledMealId: string,
    profileId: string,
  ): Promise<ScheduledMealRecord | null> {
    const record = await this.prisma.scheduledMeal.findFirst({
      where: {
        id: scheduledMealId,
        profileId,
        ...notDeleted,
      },
      select: this.recordSelect(profileId),
    });

    if (!record) {
      return null;
    }

    return this.toRecord(record);
  }

  async findCoreForProfileInTransaction(
    tx: Prisma.TransactionClient,
    scheduledMealId: string,
    profileId: string,
  ): Promise<ScheduledMealCoreRecord | null> {
    const record = await tx.scheduledMeal.findFirst({
      where: {
        id: scheduledMealId,
        profileId,
        ...notDeleted,
      },
      select: {
        id: true,
      },
    });

    if (!record) {
      return null;
    }

    return record;
  }

  async countByProfileAndDate(
    profileId: string,
    entryDate: string,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx ?? this.prisma;

    return client.scheduledMeal.count({
      where: {
        profileId,
        ...notDeleted,
        entryDate: parseEntryDate(entryDate),
      },
    });
  }

  async findDistinctEntryDatesForMonth(
    profileId: string,
    year: number,
    month: number,
  ): Promise<string[]> {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 0));

    const records = await this.prisma.scheduledMeal.findMany({
      where: {
        profileId,
        ...notDeleted,
        entryDate: { gte: start, lte: end },
      },
      select: { entryDate: true },
      distinct: ['entryDate'],
      orderBy: { entryDate: 'asc' },
    });

    return records.map((record) => formatEntryDate(record.entryDate));
  }

  async createRecord(
    tx: Prisma.TransactionClient,
    profileId: string,
    params: CreateScheduledMealCoreParams,
  ): Promise<string> {
    const record = await tx.scheduledMeal.create({
      data: {
        profileId,
        mealTypeId: params.mealTypeId,
        entryDate: params.entryDate,
        plannedTime: params.plannedTime,
        isExpress: params.isExpress,
        expressNote: params.expressNote,
      },
      select: { id: true },
    });

    return record.id;
  }

  async updateRecord(
    tx: Prisma.TransactionClient,
    scheduledMealId: string,
    params: UpdateScheduledMealCoreParams,
  ): Promise<void> {
    await tx.scheduledMeal.update({
      where: { id: scheduledMealId },
      data: {
        ...(params.mealTypeId && { mealTypeId: params.mealTypeId }),
        ...(params.entryDate && { entryDate: params.entryDate }),
        ...(params.plannedTime && { plannedTime: params.plannedTime }),
        ...(params.expressNote !== undefined && { expressNote: params.expressNote }),
        isExpress: params.isExpress,
        updatedAt: new Date(),
      },
    });
  }

  async softDelete(scheduledMealId: string, profileId: string): Promise<boolean> {
    const result = await this.prisma.scheduledMeal.updateMany({
      where: {
        id: scheduledMealId,
        profileId,
        ...notDeleted,
      },
      data: { deletedAt: new Date() },
    });

    return result.count > 0;
  }

  toRecipeEntities(
    records: ScheduledMealRecord['scheduledMealRecipes'],
  ): ScheduledMealRecipeEntity[] {
    return records.map((item) => ({
      id: item.id,
      recipeId: item.recipeId,
      title: item.recipe.title,
      coverUrl: item.recipe.coverUrl,
      durationMinutes: null,
      sortOrder: item.sortOrder,
    }));
  }

  hasMealLog(
    record: Pick<ScheduledMealRecord, 'mealLogs'>,
    excludeMealLogId?: string | null,
  ): boolean {
    const mealLogsIds = record.mealLogs.filter((item) => item.id !== excludeMealLogId);
    return mealLogsIds.length > 0;
  }

  private recordSelect(profileId: string) {
    return {
      id: true,
      mealTypeId: true,
      entryDate: true,
      plannedTime: true,
      isExpress: true,
      expressNote: true,
      mealType: { select: mealTypeSelect },
      scheduledMealRecipes: recipeSelect,
      scheduledMealReminders: scheduledMealReminderSelect,
      mealLogs: mealLogExistsSelect(profileId),
    };
  }

  private recordDetailSelect(profileId: string) {
    return {
      id: true,
      mealTypeId: true,
      entryDate: true,
      plannedTime: true,
      isExpress: true,
      expressNote: true,
      mealType: { select: mealTypeSelect },
      scheduledMealRecipes: recipeSelect,
      scheduledMealReminders: scheduledMealReminderSelect,
      mealLogs: mealLogCompletionSelect(profileId),
    };
  }

  private toRecord(record: {
    id: string;
    mealTypeId: string;
    entryDate: Date;
    plannedTime: Date;
    isExpress: boolean;
    expressNote: string | null;
    mealType: ScheduledMealMealTypeEntity;
    scheduledMealRecipes: ScheduledMealRecord['scheduledMealRecipes'];
    scheduledMealReminders: ScheduledMealRecord['scheduledMealReminders'];
    mealLogs: Array<{ id: string }>;
  }): ScheduledMealRecord {
    return {
      id: record.id,
      mealTypeId: record.mealTypeId,
      entryDate: record.entryDate,
      plannedTime: record.plannedTime,
      isExpress: record.isExpress,
      expressNote: record.expressNote,
      mealType: record.mealType,
      scheduledMealRecipes: record.scheduledMealRecipes,
      scheduledMealReminders: record.scheduledMealReminders,
      mealLogs: record.mealLogs,
    };
  }

  private toDetailRecord(record: {
    id: string;
    mealTypeId: string;
    entryDate: Date;
    plannedTime: Date;
    isExpress: boolean;
    expressNote: string | null;
    mealType: ScheduledMealMealTypeEntity;
    scheduledMealRecipes: ScheduledMealRecord['scheduledMealRecipes'];
    scheduledMealReminders: ScheduledMealRecord['scheduledMealReminders'];
    mealLogs: ScheduledMealCompletionRecord[];
  }): ScheduledMealDetailRecord {
    return {
      id: record.id,
      mealTypeId: record.mealTypeId,
      entryDate: record.entryDate,
      plannedTime: record.plannedTime,
      isExpress: record.isExpress,
      expressNote: record.expressNote,
      mealType: record.mealType,
      scheduledMealRecipes: record.scheduledMealRecipes,
      scheduledMealReminders: record.scheduledMealReminders,
      mealLogs: record.mealLogs,
    };
  }
}
