import type { HomeRecommendationEntity } from '@modules/recipes/domain/entities/home-recommendation.entity';
import type { HomeStreakEntity } from '@modules/streaks/domain/entities/home-streak.entity';
import type { HomeRegisteredMealEntity } from '@modules/meal-logs/domain/entities/home-registered-meal.entity';
import type { HomeScheduledMealEntity } from './home-scheduled-meal.entity';

export interface HomeRegisteredTodayEntity {
  readonly count: number;
  readonly meals: readonly HomeRegisteredMealEntity[];
}

export interface HomeEntity {
  readonly date: string;
  readonly nextMeal: HomeScheduledMealEntity | null;
  readonly streak: HomeStreakEntity;
  readonly upcomingMeals: readonly HomeScheduledMealEntity[];
  readonly registeredToday: HomeRegisteredTodayEntity;
  readonly recommendation: HomeRecommendationEntity | null;
}
