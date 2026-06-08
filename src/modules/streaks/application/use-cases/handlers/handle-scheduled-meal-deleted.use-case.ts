import { Injectable } from '@nestjs/common';
import type { ScheduledMealDeletedEvent } from '@modules/planner/scheduled-meals/domain/events/scheduled-meal-deleted.event';
import { SyncDailyActivityForDateUseCase } from '../sync-daily-activity-for-date.use-case';

@Injectable()
export class HandleScheduledMealDeletedUseCase {
  constructor(private readonly syncDailyActivityForDateUseCase: SyncDailyActivityForDateUseCase) {}

  async execute(event: ScheduledMealDeletedEvent): Promise<void> {
    await this.syncDailyActivityForDateUseCase.execute(event.profileId, event.entryDate);
  }
}
