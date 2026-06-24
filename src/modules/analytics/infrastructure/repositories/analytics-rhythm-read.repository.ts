import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import {
  formatEntryDate,
  getLocalEntryDateDayRange,
  parseEntryDate,
} from '@modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util';
import type { RhythmDailyActivityRecord } from '../../domain/interfaces/rhythm-daily-activity-record.interface';
import type { RhythmLifetimeSourceRecord } from '../../domain/interfaces/rhythm-lifetime-source-record.interface';
import type { RhythmMealLogHabitRecord } from '../../domain/interfaces/rhythm-meal-log-habit-record.interface';

const notDeleted = { deletedAt: null } as const;

const dailyActivitySelect = {
  date: true,
  weekStart: true,
  mealsPlanned: true,
  mealsRegistered: true,
  completionPercentage: true,
  countsForStreak: true,
} satisfies Prisma.UserDailyActivitySelect;

type DailyActivityDbRecord = Prisma.UserDailyActivityGetPayload<{
  select: typeof dailyActivitySelect;
}>;

const mealLogHabitSelect = {
  loggedAt: true,
  mealType: {
    select: { name: true },
  },
  tagLinks: {
    where: { tag: { deletedAt: null, category: 'meal_logs' } },
    select: {
      tag: {
        select: { name: true },
      },
    },
  },
} satisfies Prisma.MealLogSelect;

type MealLogHabitDbRecord = Prisma.MealLogGetPayload<{
  select: typeof mealLogHabitSelect;
}>;

@Injectable()
export class AnalyticsRhythmReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findDailyActivityInRange(
    profileId: string,
    startDate: string,
    endDate: string,
  ): Promise<RhythmDailyActivityRecord[]> {
    const records: DailyActivityDbRecord[] = await this.prisma.userDailyActivity.findMany({
      where: {
        profileId,
        date: {
          gte: parseEntryDate(startDate),
          lte: parseEntryDate(endDate),
        },
      },
      orderBy: { date: 'asc' },
      select: dailyActivitySelect,
    });

    return records.map((record) => this.toDailyActivityRecord(record));
  }

  async findLifetimeSource(profileId: string): Promise<RhythmLifetimeSourceRecord> {
    const [streak, dailyActivities, totalMealsLogged] = await Promise.all([
      this.prisma.userStreak.findFirst({
        where: { profileId },
        orderBy: { updatedAt: 'desc' },
        select: { longestStreak: true },
      }),
      this.prisma.userDailyActivity.findMany({
        where: { profileId },
        select: {
          date: true,
          weekStart: true,
          mealsPlanned: true,
          completionPercentage: true,
        },
        orderBy: { date: 'asc' },
      }),
      this.prisma.mealLog.count({
        where: {
          profileId,
          ...notDeleted,
        },
      }),
    ]);

    return {
      longestStreak: streak?.longestStreak ?? 0,
      totalMealsLogged,
      dailyActivities: dailyActivities.map((activity) => ({
        entryDate: formatEntryDate(activity.date),
        weekStart: activity.weekStart ? formatEntryDate(activity.weekStart) : null,
        mealsPlanned: activity.mealsPlanned,
        completionPercentage: activity.completionPercentage?.toNumber() ?? null,
      })),
    };
  }

  async findMealLogHabitsBetweenDates(
    profileId: string,
    startDate: string,
    endDate: string,
  ): Promise<RhythmMealLogHabitRecord[]> {
    const startRange = getLocalEntryDateDayRange(startDate).start;
    const endRange = getLocalEntryDateDayRange(endDate).end;

    const records: MealLogHabitDbRecord[] = await this.prisma.mealLog.findMany({
      where: {
        profileId,
        ...notDeleted,
        loggedAt: {
          gte: startRange,
          lt: endRange,
        },
      },
      orderBy: { loggedAt: 'asc' },
      select: mealLogHabitSelect,
    });

    return records.map((record) => this.toMealLogHabitRecord(record));
  }

  private toDailyActivityRecord(record: DailyActivityDbRecord): RhythmDailyActivityRecord {
    return {
      entryDate: formatEntryDate(record.date),
      weekStart: record.weekStart ? formatEntryDate(record.weekStart) : null,
      mealsPlanned: record.mealsPlanned,
      mealsRegistered: record.mealsRegistered,
      completionPercentage: record.completionPercentage?.toNumber() ?? null,
      countsForStreak: record.countsForStreak,
    };
  }

  private toMealLogHabitRecord(record: MealLogHabitDbRecord): RhythmMealLogHabitRecord {
    return {
      loggedAt: record.loggedAt,
      mealTypeName: record.mealType?.name ?? null,
      tagNames: record.tagLinks.map((link) => link.tag.name),
    };
  }
}
