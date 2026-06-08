import { Injectable } from '@nestjs/common';
import type { MealLogUpdatedEvent } from '@modules/meal-logs/domain/events/meal-log-updated.event';
import { resolveAffectedEntryDates } from '../../../domain/utils/affected-entry-dates.util';
import { RecalculateStreakUseCase } from '../recalculate-streak.use-case';
import { SyncDailyActivityForDateUseCase } from '../sync-daily-activity-for-date.use-case';

@Injectable()
export class HandleMealLogUpdatedUseCase {
  constructor(
    private readonly syncDailyActivityForDateUseCase: SyncDailyActivityForDateUseCase,
    private readonly recalculateStreakUseCase: RecalculateStreakUseCase,
  ) {}

  async execute(event: MealLogUpdatedEvent): Promise<void> {
    const affectedDates = resolveAffectedEntryDates(event.entryDate, event.previousEntryDate);

    for (const entryDate of affectedDates) {
      await this.syncDailyActivityForDateUseCase.execute(event.profileId, entryDate);
    }

    await this.recalculateStreakUseCase.execute(event.profileId, {
      recalculateCurrent: true,
      recalculateLongest: true,
    });
  }
}
