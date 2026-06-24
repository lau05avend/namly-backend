import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class RhythmWeekSummaryDto {
  @IsIn(['stable', 'active', 'irregular', 'quiet'])
  level!: 'stable' | 'active' | 'irregular' | 'quiet';

  @IsIn(['positive', 'neutral'])
  tone!: 'positive' | 'neutral';

  @IsString()
  message!: string;
}

export class RhythmWeekComparisonDto {
  @IsOptional()
  @IsNumber()
  deltaPercentage!: number | null;

  @IsOptional()
  @IsString()
  message!: string | null;
}

export class RhythmWeekDayDto {
  @IsString()
  date!: string;

  @IsInt()
  @Min(0)
  intensity!: number;

  @IsBoolean()
  isToday!: boolean;
}

export class RhythmWeekDto {
  @IsString()
  weekStart!: string;

  @IsString()
  weekEnd!: string;

  @ValidateNested()
  @Type(() => RhythmWeekSummaryDto)
  summary!: RhythmWeekSummaryDto;

  @IsInt()
  @Min(0)
  activeDays!: number;

  @IsInt()
  @Min(1)
  totalDays!: number;

  @IsInt()
  @Min(0)
  averageCompletion!: number;

  @ValidateNested()
  @Type(() => RhythmWeekComparisonDto)
  comparison!: RhythmWeekComparisonDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RhythmWeekDayDto)
  days!: RhythmWeekDayDto[];
}

export class RhythmInsightDto {
  @IsString()
  id!: string;

  @IsIn(['meal_type', 'time_slot', 'tag_pattern'])
  type!: 'meal_type' | 'time_slot' | 'tag_pattern';

  @IsString()
  icon!: string;

  @IsIn(['positive', 'neutral'])
  tone!: 'positive' | 'neutral';

  @IsString()
  message!: string;
}

export class RhythmTimeSlotDistributionDto {
  @IsInt()
  @Min(0)
  morning!: number;

  @IsInt()
  @Min(0)
  midday!: number;

  @IsInt()
  @Min(0)
  afternoon!: number;

  @IsInt()
  @Min(0)
  night!: number;
}

export class RhythmHabitsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RhythmInsightDto)
  insights!: RhythmInsightDto[];

  @ValidateNested()
  @Type(() => RhythmTimeSlotDistributionDto)
  timeSlotDistribution!: RhythmTimeSlotDistributionDto;
}

export class RhythmLifetimeDto {
  @IsInt()
  @Min(0)
  longestStreak!: number;

  @IsInt()
  @Min(0)
  bestWeekCompletion!: number;

  @IsInt()
  @Min(0)
  totalMealsLogged!: number;
}

export class AnalyticsRhythmDto {
  @ValidateNested()
  @Type(() => RhythmWeekDto)
  week!: RhythmWeekDto;

  @ValidateNested()
  @Type(() => RhythmHabitsDto)
  habits!: RhythmHabitsDto;

  @ValidateNested()
  @Type(() => RhythmLifetimeDto)
  lifetime!: RhythmLifetimeDto;
}
