import { Injectable } from '@nestjs/common';
import type { HomeStreakEntity } from '../domain/entities/home-streak.entity';
import { resolveGrowthStageId } from '../domain/utils/resolve-growth-stage-id.util';
import { StreaksReadRepository } from '../infrastructure/repositories/streaks-read.repository';

@Injectable()
export class StreaksReadService {
  constructor(private readonly streaksReadRepository: StreaksReadRepository) {}

  async getHomeStreak(profileId: string, entryDate: string): Promise<HomeStreakEntity> {
    const source = await this.streaksReadRepository.findHomeStreakSource(profileId, entryDate);

    return {
      currentDays: source.currentStreak,
      mealsLoggedToday: source.mealsRegistered,
      mealsGoalToday: source.mealsPlanned,
      growthStageId: resolveGrowthStageId(source.currentStreak),
    };
  }
}
