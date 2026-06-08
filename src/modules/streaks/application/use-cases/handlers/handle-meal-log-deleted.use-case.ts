import { Injectable } from '@nestjs/common';
import type { MealLogDeletedEvent } from '@modules/meal-logs/domain/events/meal-log-deleted.event';
import { RecalculateStreakUseCase } from '../recalculate-streak.use-case';
import { SyncDailyActivityForDateUseCase } from '../sync-daily-activity-for-date.use-case';

@Injectable()
export class HandleMealLogDeletedUseCase {
  constructor(
    private readonly syncDailyActivityForDateUseCase: SyncDailyActivityForDateUseCase,
    private readonly recalculateStreakUseCase: RecalculateStreakUseCase,
  ) {}

  async execute(event: MealLogDeletedEvent): Promise<void> {
    await this.syncDailyActivityForDateUseCase.execute(event.profileId, event.entryDate);

    await this.recalculateStreakUseCase.execute(event.profileId, {
      recalculateCurrent: true,
      recalculateLongest: true,
    });
  }
}
