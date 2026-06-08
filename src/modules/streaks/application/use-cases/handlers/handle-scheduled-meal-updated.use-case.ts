import { Injectable } from '@nestjs/common';
import type { ScheduledMealUpdatedEvent } from '@modules/planner/scheduled-meals/domain/events/scheduled-meal-updated.event';
import { resolveAffectedEntryDates } from '../../../domain/utils/affected-entry-dates.util';
import { SyncDailyActivityForDateUseCase } from '../sync-daily-activity-for-date.use-case';

@Injectable()
export class HandleScheduledMealUpdatedUseCase {
  constructor(private readonly syncDailyActivityForDateUseCase: SyncDailyActivityForDateUseCase) {}

  async execute(event: ScheduledMealUpdatedEvent): Promise<void> {
    const affectedDates = resolveAffectedEntryDates(event.entryDate, event.previousEntryDate);

    for (const entryDate of affectedDates) {
      await this.syncDailyActivityForDateUseCase.execute(event.profileId, entryDate);
    }
  }
}
