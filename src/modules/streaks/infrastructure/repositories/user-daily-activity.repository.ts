import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import {
  formatEntryDate,
  parseEntryDate,
} from '@modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util';

export type UserDailyActivityRecord = {
  entryDate: string;
  countsForStreak: boolean;
};

export type UpsertUserDailyActivityParams = {
  weekStart: string;
  mealsPlanned: number;
  mealsRegistered: number;
  completionPercentage: number | null;
  countsForStreak: boolean;
};

@Injectable()
export class UserDailyActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProfileAndDate(
    profileId: string,
    entryDate: string,
    tx?: Prisma.TransactionClient,
  ): Promise<UserDailyActivityRecord | null> {
    const client = tx ?? this.prisma;
    const record = await client.userDailyActivity.findUnique({
      where: {
        profileId_date: {
          profileId,
          date: parseEntryDate(entryDate),
        },
      },
      select: {
        date: true,
        countsForStreak: true,
      },
    });

    if (!record) {
      return null;
    }

    return {
      entryDate: formatEntryDate(record.date),
      countsForStreak: record.countsForStreak,
    };
  }

  async findQualifyingEntryDatesInRange(
    profileId: string,
    startDate: string,
    endDate: string,
    tx?: Prisma.TransactionClient,
  ): Promise<string[]> {
    const records = await this.findByProfileAndDateRange(profileId, startDate, endDate, tx);
    return records.map((record) => record.entryDate);
  }

  async findAllQualifyingEntryDatesForProfile(profileId: string): Promise<string[]> {
    const records = await this.prisma.userDailyActivity.findMany({
      where: {
        profileId,
        countsForStreak: true,
      },
      select: { date: true },
      orderBy: { date: 'asc' },
    });

    return records.map((record) => formatEntryDate(record.date));
  }

  async findByProfileAndDateRange(
    profileId: string,
    startDate: string,
    endDate: string,
    tx?: Prisma.TransactionClient,
  ): Promise<UserDailyActivityRecord[]> {
    const client = tx ?? this.prisma;
    const records = await client.userDailyActivity.findMany({
      where: {
        profileId,
        date: {
          gte: parseEntryDate(startDate),
          lte: parseEntryDate(endDate),
        },
        countsForStreak: true,
      },
      select: {
        date: true,
        countsForStreak: true,
      },
      orderBy: { date: 'asc' },
    });

    return records.map((record) => ({
      entryDate: formatEntryDate(record.date),
      countsForStreak: record.countsForStreak,
    }));
  }

  async upsertForDate(
    profileId: string,
    entryDate: string,
    params: UpsertUserDailyActivityParams,
    tx?: Prisma.TransactionClient,
  ): Promise<UserDailyActivityRecord> {
    const client = tx ?? this.prisma;
    const date = parseEntryDate(entryDate);
    const weekStart = parseEntryDate(params.weekStart);

    const record = await client.userDailyActivity.upsert({
      where: {
        profileId_date: {
          profileId,
          date,
        },
      },
      create: {
        profileId,
        date,
        weekStart,
        mealsPlanned: params.mealsPlanned,
        mealsRegistered: params.mealsRegistered,
        completionPercentage: params.completionPercentage ?? null,
        countsForStreak: params.countsForStreak,
      },
      update: {
        weekStart,
        mealsPlanned: params.mealsPlanned,
        mealsRegistered: params.mealsRegistered,
        completionPercentage: params.completionPercentage ?? null,
        countsForStreak: params.countsForStreak,
        updatedAt: new Date(),
      },
      select: {
        date: true,
        countsForStreak: true,
      },
    });

    return {
      entryDate: formatEntryDate(record.date),
      countsForStreak: record.countsForStreak,
    };
  }
}
