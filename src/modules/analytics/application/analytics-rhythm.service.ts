import { Injectable } from '@nestjs/common';
import { formatFloatingLocalEntryDate } from '@modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util';
import { getWeekStart } from '@modules/streaks/domain/utils/week-start.util';
import type { AnalyticsRhythmEntity } from '../domain/entities/analytics-rhythm.entity';
import {
  buildRhythmHabitsEntity,
  resolveHabitWindowRanges,
} from '../domain/utils/build-rhythm-habits.util';
import { buildRhythmWeekEntity } from '../domain/utils/build-rhythm-week.util';
import { addDays, getWeekEnd } from '../domain/utils/entry-date-range.util';
import { resolveBestWeekCompletion } from '../domain/utils/resolve-best-week-completion.util';
import { AnalyticsRhythmReadRepository } from '../infrastructure/repositories/analytics-rhythm-read.repository';

@Injectable()
export class AnalyticsRhythmService {
  constructor(private readonly analyticsRhythmReadRepository: AnalyticsRhythmReadRepository) {}

  async getRhythm(profileId: string, weekStartParam?: string): Promise<AnalyticsRhythmEntity> {
    const today = formatFloatingLocalEntryDate(new Date());
    const anchorDate = weekStartParam ?? today;
    const weekStart = getWeekStart(anchorDate);
    const weekEnd = getWeekEnd(weekStart);
    const previousWeekStart = addDays(weekStart, -7);
    const previousWeekEnd = addDays(weekStart, -1);
    const habitWindows = resolveHabitWindowRanges(today);

    const [
      currentWeekActivities,
      previousWeekActivities,
      lifetimeSource,
      mealTypeWindowRecords,
      currentTagWindowRecords,
      previousTagWindowRecords,
    ] = await Promise.all([
      this.analyticsRhythmReadRepository.findDailyActivityInRange(
        profileId,
        weekStart,
        weekEnd,
      ),
      this.analyticsRhythmReadRepository.findDailyActivityInRange(
        profileId,
        previousWeekStart,
        previousWeekEnd,
      ),
      this.analyticsRhythmReadRepository.findLifetimeSource(profileId),
      this.analyticsRhythmReadRepository.findMealLogHabitsBetweenDates(
        profileId,
        habitWindows.mealTypeWindowStart,
        today,
      ),
      this.analyticsRhythmReadRepository.findMealLogHabitsBetweenDates(
        profileId,
        habitWindows.currentTagWindowStart,
        today,
      ),
      this.analyticsRhythmReadRepository.findMealLogHabitsBetweenDates(
        profileId,
        habitWindows.previousTagWindowStart,
        habitWindows.previousTagWindowEnd,
      ),
    ]);

    return {
      week: buildRhythmWeekEntity({
        weekStart,
        weekEnd,
        today,
        currentWeekActivities,
        previousWeekActivities,
      }),
      habits: buildRhythmHabitsEntity({
        today,
        mealTypeWindowRecords,
        currentTagWindowRecords,
        previousTagWindowRecords,
      }),
      lifetime: {
        longestStreak: lifetimeSource.longestStreak,
        bestWeekCompletion: resolveBestWeekCompletion(lifetimeSource),
        totalMealsLogged: lifetimeSource.totalMealsLogged,
      },
    };
  }
}
