import { Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import {
  formatEntryDate,
  parseEntryDate,
} from '@modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util';
import type { StreakStateParams } from '../../domain/interfaces/upsert-streak-params.interface';

const streakSelect = {
  currentStreak: true,
  longestStreak: true,
  lastActiveDate: true,
  currentStreakStartDate: true,
} satisfies Prisma.UserStreakSelect;

type UserStreakRecord = Prisma.UserStreakGetPayload<{ select: typeof streakSelect }>;

@Injectable()
export class UserStreakRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByProfileId(
    profileId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<StreakStateParams | null> {
    const client = tx ?? this.prisma;
    const record = await client.userStreak.findFirst({
      where: { profileId },
      orderBy: { updatedAt: 'desc' },
      select: streakSelect,
    });

    if (!record) {
      return null;
    }

    return this.toStreakState(record);
  }

  async upsertForProfile(
    profileId: string,
    state: StreakStateParams,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    const existing = await client.userStreak.findFirst({
      where: { profileId },
      select: { id: true },
      orderBy: { updatedAt: 'desc' },
    });

    const lastActiveDate = state.lastActiveDate?.trim()
      ? parseEntryDate(state.lastActiveDate)
      : null;
    const currentStreakStartDate = state.currentStreakStartDate?.trim()
      ? parseEntryDate(state.currentStreakStartDate)
      : null;

    if (existing) {
      await client.userStreak.update({
        where: { id: existing.id },
        data: {
          currentStreak: state.currentStreak,
          longestStreak: state.longestStreak,
          lastActiveDate,
          currentStreakStartDate,
          updatedAt: new Date(),
        },
      });
      return;
    }

    await client.userStreak.create({
      data: {
        profileId,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastActiveDate,
        currentStreakStartDate,
      },
    });
  }

  private toStreakState(record: UserStreakRecord): StreakStateParams {
    return {
      currentStreak: record.currentStreak,
      longestStreak: record.longestStreak,
      lastActiveDate: record.lastActiveDate ? formatEntryDate(record.lastActiveDate) : null,
      currentStreakStartDate: record.currentStreakStartDate
        ? formatEntryDate(record.currentStreakStartDate)
        : null,
    };
  }
}
