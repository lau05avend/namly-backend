import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { parseEntryDate } from '@modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util';
import type { HomeStreakSource } from '../../domain/interfaces/home-streak-source.interface';

@Injectable()
export class StreaksReadRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findHomeStreakSource(profileId: string, entryDate: string): Promise<HomeStreakSource> {
    const date = parseEntryDate(entryDate);

    const [streak, activity] = await Promise.all([
      this.prisma.userStreak.findFirst({
        where: { profileId },
        orderBy: { updatedAt: 'desc' },
        select: { currentStreak: true },
      }),
      this.prisma.userDailyActivity.findUnique({
        where: {
          profileId_date: {
            profileId,
            date,
          },
        },
        select: {
          mealsPlanned: true,
          mealsRegistered: true,
        },
      }),
    ]);

    return {
      currentStreak: streak?.currentStreak ?? 0,
      mealsPlanned: activity?.mealsPlanned ?? 0,
      mealsRegistered: activity?.mealsRegistered ?? 0,
    };
  }
}
