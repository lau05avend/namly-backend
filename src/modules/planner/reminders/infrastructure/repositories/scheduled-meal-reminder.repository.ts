import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import type { ScheduledMealReminderEntity } from '../../domain/entities/scheduled-meal-reminder.entity';

const reminderSelect = {
  id: true,
  offsetMinutes: true,
} as const;

export type DueScheduledMealReminderRecord = {
  id: string;
  offsetMinutes: number;
  scheduledMeal: {
    id: string;
    profileId: string;
    entryDate: Date;
    plannedTime: Date;
    isExpress: boolean;
    expressNote: string | null;
    mealType: { name: string };
    scheduledMealRecipes: Array<{ recipe: { title: string } }>;
    mealLogs: Array<{ id: string }>;
  };
};

@Injectable()
export class ScheduledMealReminderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async syncForScheduledMeal(
    tx: Prisma.TransactionClient,
    scheduledMealId: string,
    offsetMinutesList: readonly number[],
  ): Promise<void> {
    await tx.scheduledMealReminder.deleteMany({
      where: { scheduledMealId },
    });

    if (offsetMinutesList.length === 0) {
      return;
    }

    await tx.scheduledMealReminder.createMany({
      data: offsetMinutesList.map((offsetMinutes) => ({
        scheduledMealId,
        offsetMinutes,
      })),
    });
  }

  async deactivateByScheduledMealId(scheduledMealId: string): Promise<void> {
    await this.prisma.scheduledMealReminder.updateMany({
      where: {
        scheduledMealId,
        isActive: true,
      },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });
  }

  async markNotified(reminderId: string): Promise<boolean> {
    const result = await this.prisma.scheduledMealReminder.updateMany({
      where: {
        id: reminderId,
        isNotified: false,
      },
      data: {
        isNotified: true,
        updatedAt: new Date(),
      },
    });

    return result.count > 0;
  }

  async findDueCandidates(): Promise<DueScheduledMealReminderRecord[]> {
    return this.prisma.scheduledMealReminder.findMany({
      where: {
        isActive: true,
        isNotified: false,
        scheduledMeal: {
          deletedAt: null,
          mealLogs: {
            none: { deletedAt: null },
          },
        },
      },
      select: {
        id: true,
        offsetMinutes: true,
        scheduledMeal: {
          select: {
            id: true,
            profileId: true,
            entryDate: true,
            plannedTime: true,
            isExpress: true,
            expressNote: true,
            mealType: { select: { name: true } },
            scheduledMealRecipes: {
              orderBy: { sortOrder: 'asc' },
              select: {
                recipe: { select: { title: true } },
              },
            },
            mealLogs: {
              where: { deletedAt: null },
              select: { id: true },
              take: 1,
            },
          },
        },
      },
    });
  }

  toEntities(records: Array<{ id: string; offsetMinutes: number }>): ScheduledMealReminderEntity[] {
    return records
      .map((record) => ({
        id: record.id,
        offsetMinutes: record.offsetMinutes,
      }))
      .sort((left, right) => right.offsetMinutes - left.offsetMinutes);
  }
}

export const scheduledMealReminderSelect = {
  where: { isActive: true },
  orderBy: { offsetMinutes: 'desc' as const },
  select: reminderSelect,
};
