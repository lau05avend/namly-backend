import type { AnalyticsRhythmEntity } from '../../domain/entities/analytics-rhythm.entity';
import {
  AnalyticsRhythmDto,
  RhythmHabitsDto,
  RhythmInsightDto,
  RhythmLifetimeDto,
  RhythmTimeSlotDistributionDto,
  RhythmWeekComparisonDto,
  RhythmWeekDayDto,
  RhythmWeekDto,
  RhythmWeekSummaryDto,
} from '../dto/analytics-rhythm.dto';

export class AnalyticsRhythmMapper {
  static toDto(entity: AnalyticsRhythmEntity): AnalyticsRhythmDto {
    const dto = new AnalyticsRhythmDto();
    dto.week = this.toWeekDto(entity.week);
    dto.habits = this.toHabitsDto(entity.habits);
    dto.lifetime = this.toLifetimeDto(entity.lifetime);
    return dto;
  }

  private static toWeekDto(entity: AnalyticsRhythmEntity['week']): RhythmWeekDto {
    const dto = new RhythmWeekDto();
    dto.weekStart = entity.weekStart;
    dto.weekEnd = entity.weekEnd;
    dto.summary = this.toSummaryDto(entity.summary);
    dto.activeDays = entity.activeDays;
    dto.totalDays = entity.totalDays;
    dto.averageCompletion = entity.averageCompletion;
    dto.comparison = this.toComparisonDto(entity.comparison);
    dto.days = entity.days.map((day) => this.toDayDto(day));
    return dto;
  }

  private static toSummaryDto(entity: AnalyticsRhythmEntity['week']['summary']): RhythmWeekSummaryDto {
    const dto = new RhythmWeekSummaryDto();
    dto.level = entity.level;
    dto.tone = entity.tone;
    dto.message = entity.message;
    return dto;
  }

  private static toComparisonDto(
    entity: AnalyticsRhythmEntity['week']['comparison'],
  ): RhythmWeekComparisonDto {
    const dto = new RhythmWeekComparisonDto();
    dto.deltaPercentage = entity.deltaPercentage;
    dto.message = entity.message;
    return dto;
  }

  private static toDayDto(entity: AnalyticsRhythmEntity['week']['days'][number]): RhythmWeekDayDto {
    const dto = new RhythmWeekDayDto();
    dto.date = entity.date;
    dto.intensity = entity.intensity;
    dto.isToday = entity.isToday;
    return dto;
  }

  private static toHabitsDto(entity: AnalyticsRhythmEntity['habits']): RhythmHabitsDto {
    const dto = new RhythmHabitsDto();
    dto.insights = entity.insights.map((insight) => this.toInsightDto(insight));
    dto.timeSlotDistribution = this.toTimeSlotDistributionDto(entity.timeSlotDistribution);
    return dto;
  }

  private static toInsightDto(
    entity: AnalyticsRhythmEntity['habits']['insights'][number],
  ): RhythmInsightDto {
    const dto = new RhythmInsightDto();
    dto.id = entity.id;
    dto.type = entity.type;
    dto.icon = entity.icon;
    dto.tone = entity.tone;
    dto.message = entity.message;
    return dto;
  }

  private static toTimeSlotDistributionDto(
    entity: AnalyticsRhythmEntity['habits']['timeSlotDistribution'],
  ): RhythmTimeSlotDistributionDto {
    const dto = new RhythmTimeSlotDistributionDto();
    dto.morning = entity.morning;
    dto.midday = entity.midday;
    dto.afternoon = entity.afternoon;
    dto.night = entity.night;
    return dto;
  }

  private static toLifetimeDto(entity: AnalyticsRhythmEntity['lifetime']): RhythmLifetimeDto {
    const dto = new RhythmLifetimeDto();
    dto.longestStreak = entity.longestStreak;
    dto.bestWeekCompletion = entity.bestWeekCompletion;
    dto.totalMealsLogged = entity.totalMealsLogged;
    return dto;
  }
}
