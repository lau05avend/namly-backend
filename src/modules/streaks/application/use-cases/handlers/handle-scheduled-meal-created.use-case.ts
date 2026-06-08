import { Injectable } from '@nestjs/common';
import type { ScheduledMealCreatedEvent } from '@modules/planner/scheduled-meals/domain/events/scheduled-meal-created.event';
import { SyncDailyActivityForDateUseCase } from '../sync-daily-activity-for-date.use-case';

@Injectable()
export class HandleScheduledMealCreatedUseCase {
  constructor(private readonly syncDailyActivityForDateUseCase: SyncDailyActivityForDateUseCase) {}

  async execute(event: ScheduledMealCreatedEvent): Promise<void> {
    await this.syncDailyActivityForDateUseCase.execute(event.profileId, event.entryDate);
  }
}
