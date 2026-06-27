import type { HomeRegisteredMealEntity } from '@modules/meal-logs/domain/entities/home-registered-meal.entity';
import type { HomeRecommendationEntity } from '@modules/recipes/domain/entities/home-recommendation.entity';
import type { HomeStreakEntity } from '@modules/streaks/domain/entities/home-streak.entity';
import type { HomeEntity } from '../../domain/entities/home.entity';
import type { HomeScheduledMealEntity } from '../../domain/entities/home-scheduled-meal.entity';
import {
  HomeDto,
  HomeRecommendationDto,
  HomeRegisteredMealDto,
  HomeRegisteredTodayDto,
  HomeScheduledMealDto,
  HomeScheduledMealItemDto,
  HomeMealTypeDto,
  HomeStreakDto,
} from '../dto/home.dto';

export class HomeMapper {
  static toDto(entity: HomeEntity): HomeDto {
    const dto = new HomeDto();
    dto.date = entity.date;
    dto.nextMeal = entity.nextMeal ? this.toScheduledMealDto(entity.nextMeal) : null;
    dto.streak = this.toStreakDto(entity.streak);
    dto.upcomingMeals = entity.upcomingMeals.map((meal) => this.toScheduledMealDto(meal));
    dto.registeredToday = this.toRegisteredTodayDto(entity.registeredToday);
    dto.recommendation = entity.recommendation
      ? this.toRecommendationDto(entity.recommendation)
      : null;
    return dto;
  }

  private static toScheduledMealDto(entity: HomeScheduledMealEntity): HomeScheduledMealDto {
    const dto = new HomeScheduledMealDto();
    dto.id = entity.id;
    dto.mealType = this.toMealTypeDto(entity.mealType);
    dto.entryDate = entity.entryDate;
    dto.plannedTime = entity.plannedTime;
    dto.isExpress = entity.isExpress;
    dto.title = entity.title;
    dto.items = entity.items.map((item) => this.toScheduledMealItemDto(item));
    dto.moreCount = entity.moreCount;
    return dto;
  }

  private static toMealTypeDto(entity: HomeScheduledMealEntity['mealType']): HomeMealTypeDto {
    const dto = new HomeMealTypeDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.sortOrder = entity.sortOrder;
    return dto;
  }

  private static toScheduledMealItemDto(
    entity: HomeScheduledMealEntity['items'][number],
  ): HomeScheduledMealItemDto {
    const dto = new HomeScheduledMealItemDto();
    dto.id = entity.id;
    dto.label = entity.label;
    return dto;
  }

  private static toStreakDto(entity: HomeStreakEntity): HomeStreakDto {
    const dto = new HomeStreakDto();
    dto.currentDays = entity.currentDays;
    dto.mealsLoggedToday = entity.mealsLoggedToday;
    dto.mealsGoalToday = entity.mealsGoalToday;
    dto.growthStageId = entity.growthStageId;
    return dto;
  }

  private static toRegisteredTodayDto(
    entity: HomeEntity['registeredToday'],
  ): HomeRegisteredTodayDto {
    const dto = new HomeRegisteredTodayDto();
    dto.count = entity.count;
    dto.meals = entity.meals.map((meal) => this.toRegisteredMealDto(meal));
    return dto;
  }

  private static toRegisteredMealDto(entity: HomeRegisteredMealEntity): HomeRegisteredMealDto {
    const dto = new HomeRegisteredMealDto();
    dto.id = entity.id;
    dto.mealTypeName = entity.mealTypeName;
    dto.loggedAt = entity.loggedAt;
    dto.detail = entity.detail ?? '';
    dto.mediaUrl = entity.mediaUrl ?? '';
    return dto;
  }

  private static toRecommendationDto(entity: HomeRecommendationEntity): HomeRecommendationDto {
    const dto = new HomeRecommendationDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.meta = entity.meta;
    dto.imageUrl = entity.imageUrl ?? '';
    return dto;
  }
}
