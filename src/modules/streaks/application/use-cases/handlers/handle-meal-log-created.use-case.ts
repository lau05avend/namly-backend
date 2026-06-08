import { Injectable } from '@nestjs/common';
import type { MealLogCreatedEvent } from '@modules/meal-logs/domain/events/meal-log-created.event';
import { formatFloatingLocalEntryDate } from '@modules/planner/scheduled-meals/domain/utils/scheduled-meal-datetime.util';
import {
  affectsCurrentStreak,
  classifyAffectedDateCategory,
  requiresLongestStreakRecalculation,
  shouldPromoteLongestFromCurrent,
} from '../../../domain/utils/streak-affected-date-category.util';
import { RecalculateStreakUseCase } from '../recalculate-streak.use-case';
import { SyncDailyActivityForDateUseCase } from '../sync-daily-activity-for-date.use-case';
import { UserStreakRepository } from '../../../infrastructure/repositories/user-streak.repository';

@Injectable()
export class HandleMealLogCreatedUseCase {
  constructor(
    private readonly syncDailyActivityForDateUseCase: SyncDailyActivityForDateUseCase,
    private readonly recalculateStreakUseCase: RecalculateStreakUseCase,
    private readonly userStreakRepository: UserStreakRepository,
  ) {}

  async execute(event: MealLogCreatedEvent): Promise<void> {
    const entryDate = formatFloatingLocalEntryDate(event.loggedAt);

    await this.syncDailyActivityForDateUseCase.execute(event.profileId, entryDate);

    const existing = await this.userStreakRepository.findByProfileId(event.profileId);
    const category = classifyAffectedDateCategory(entryDate, existing);

    await this.recalculateStreakUseCase.execute(event.profileId, {
      recalculateCurrent: affectsCurrentStreak(category),
      recalculateLongest: requiresLongestStreakRecalculation(category),
      promoteLongestFromCurrent: shouldPromoteLongestFromCurrent(category),
      affectedDate: entryDate,
      category,
    });
  }
}
