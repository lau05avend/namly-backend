import { Injectable } from '@nestjs/common';
import { MealLogsService } from '@modules/meal-logs/application/meal-logs.service';
import { ScheduledMealsService } from '@modules/planner/scheduled-meals/application/scheduled-meals.service';
import {
  computeCompletionPercentage,
  computeCountsForStreak,
} from '../../domain/utils/daily-activity-metrics.util';
import { getWeekStart } from '../../domain/utils/week-start.util';
import { UserDailyActivityRepository } from '../../infrastructure/repositories/user-daily-activity.repository';

export type SyncDailyActivityForDateResult = {
  countsForStreak: boolean;
};

@Injectable()
export class SyncDailyActivityForDateUseCase {
  constructor(
    private readonly scheduledMealsService: ScheduledMealsService,
    private readonly mealLogsService: MealLogsService,
    private readonly userDailyActivityRepository: UserDailyActivityRepository,
  ) {}

  async execute(profileId: string, entryDate: string): Promise<SyncDailyActivityForDateResult> {
    const mealsPlanned: number = await this.scheduledMealsService.countByProfileAndDate(
      profileId,
      entryDate,
    );
    const mealsRegistered: number = await this.mealLogsService.countByProfileAndEntryDate(
      profileId,
      entryDate,
    );

    const weekStart = getWeekStart(entryDate);
    // TODO: Revisar calculo de este porcentaje en escenarios más complejos de fechas no contemplados
    const completionPercentage = computeCompletionPercentage(mealsPlanned, mealsRegistered);
    const countsForStreak = computeCountsForStreak(mealsRegistered);

    await this.userDailyActivityRepository.upsertForDate(profileId, entryDate, {
      weekStart,
      mealsPlanned,
      mealsRegistered,
      completionPercentage,
      countsForStreak,
    });

    return { countsForStreak };
  }
}
