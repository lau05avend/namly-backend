import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class HomeMealTypeDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsInt()
  @Min(0)
  sortOrder!: number;
}

export class HomeScheduledMealItemDto {
  @IsUUID()
  id!: string;

  @IsString()
  label!: string;
}

export class HomeScheduledMealDto {
  @IsUUID()
  id!: string;

  @ValidateNested()
  @Type(() => HomeMealTypeDto)
  mealType!: HomeMealTypeDto;

  @IsString()
  entryDate!: string;

  @IsString()
  plannedTime!: string;

  @IsBoolean()
  isExpress!: boolean;

  @IsString()
  title!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HomeScheduledMealItemDto)
  items!: HomeScheduledMealItemDto[];

  @IsInt()
  @Min(0)
  moreCount!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalDurationMinutes!: number | null;
}

export class HomeStreakDto {
  @IsInt()
  @Min(0)
  currentDays!: number;

  @IsInt()
  @Min(0)
  mealsLoggedToday!: number;

  @IsInt()
  @Min(0)
  mealsGoalToday!: number;

  @IsInt()
  @Min(1)
  growthStageId!: number;
}

export class HomeRegisteredMealDto {
  @IsUUID()
  id!: string;

  @IsString()
  mealTypeName!: string;

  @IsDate()
  loggedAt!: Date;

  @IsString()
  detail!: string;

  @IsString()
  mediaUrl!: string;
}

export class HomeRegisteredTodayDto {
  @IsInt()
  @Min(0)
  count!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HomeRegisteredMealDto)
  meals!: HomeRegisteredMealDto[];
}

export class HomeRecommendationDto {
  @IsUUID()
  id!: string;

  @IsString()
  title!: string;

  @IsString()
  meta!: string;

  @IsString()
  imageUrl!: string;
}

export class HomeDto {
  @IsString()
  date!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => HomeScheduledMealDto)
  nextMeal!: HomeScheduledMealDto | null;

  @ValidateNested()
  @Type(() => HomeStreakDto)
  streak!: HomeStreakDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HomeScheduledMealDto)
  upcomingMeals!: HomeScheduledMealDto[];

  @ValidateNested()
  @Type(() => HomeRegisteredTodayDto)
  registeredToday!: HomeRegisteredTodayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HomeRecommendationDto)
  recommendation!: HomeRecommendationDto | null;
}
