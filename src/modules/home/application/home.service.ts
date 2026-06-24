import { Injectable } from '@nestjs/common';
import type { HomeRegisteredMealEntity } from '@modules/meal-logs/domain/entities/home-registered-meal.entity';
import type { ScheduledMealEntity } from '@modules/planner/scheduled-meals/domain/entities/scheduled-meal.entity';
import { ScheduledMealsService } from '@modules/planner/scheduled-meals/application/scheduled-meals.service';
import { formatFloatingLocalEntryDate } from '@modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util';
import type { HomeRecommendationEntity } from '@modules/recipes/domain/entities/home-recommendation.entity';
import type { HomeStreakEntity } from '@modules/streaks/domain/entities/home-streak.entity';
import { StreaksReadService } from '@modules/streaks/application/streaks-read.service';
import type { HomeEntity } from '../domain/entities/home.entity';
import { mapScheduledMealToHomeEntity } from '../domain/utils/map-scheduled-meal-to-home.util';
import { HomeReadRepository } from '../infrastructure/repositories/home-read.repository';

@Injectable()
export class HomeService {
  constructor(
    private readonly scheduledMealsService: ScheduledMealsService,
    private readonly streaksReadService: StreaksReadService,
    private readonly homeReadRepository: HomeReadRepository,
  ) {}

  async getHome(profileId: string, date?: string): Promise<HomeEntity> {
    const entryDate = date ?? formatFloatingLocalEntryDate(new Date());

    const scheduledMeals: ScheduledMealEntity[] = await this.scheduledMealsService.listByDate(
      profileId,
      entryDate,
    );
    const streak: HomeStreakEntity = await this.streaksReadService.getHomeStreak(
      profileId,
      entryDate,
    );

    const [registeredMeals, recommendation]: [
      HomeRegisteredMealEntity[],
      HomeRecommendationEntity | null,
    ] = await Promise.all([
      this.homeReadRepository.findRegisteredMeals(profileId, entryDate),
      this.homeReadRepository.findRecommendation(profileId),
    ]);

    const nextMealEntity = scheduledMeals.find((meal) => meal.status === 'next');
    const nextMeal = nextMealEntity ? mapScheduledMealToHomeEntity(nextMealEntity) : null;
    const upcomingMeals = scheduledMeals
      .filter((meal) => meal.status === 'upcoming')
      .map((meal) => mapScheduledMealToHomeEntity(meal));

    return {
      date: entryDate,
      nextMeal,
      streak,
      upcomingMeals,
      registeredToday: {
        count: registeredMeals.length,
        meals: registeredMeals,
      },
      recommendation,
    };
  }
}
