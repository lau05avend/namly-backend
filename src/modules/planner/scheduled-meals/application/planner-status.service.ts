import { Injectable } from '@nestjs/common';
import type { ScheduledMealStatus } from '../domain/enums/scheduled-meal-status.enum';
import type { ScheduledMealStatusInput } from '../domain/interfaces/scheduled-meal-status-input.interface';
import {
  comparePlannedMoments,
  formatEntryDate,
  getFloatingLocalNowParts,
} from '../domain/utils/scheduled-meal-datetime.util';
import {
  ScheduledMealRepository,
  type ScheduledMealRecord,
} from '../infrastructure/repositories/scheduled-meal.repository';
import { toScheduledMealStatusInput } from './scheduled-meal-entity.mapper';

export type AssignStatusesOptions = {
  readonly assignNext?: boolean;
  readonly now?: Date;
};

@Injectable()
export class PlannerStatusService {
  constructor(private readonly scheduledMealRepository: ScheduledMealRepository) {}

  isFloatingLocalToday(entryDate: string, now: Date = new Date()): boolean {
    const { entryDate: today } = getFloatingLocalNowParts(now);

    return entryDate === today;
  }

  resolveStatuses(
    meals: readonly ScheduledMealStatusInput[],
    entryDate: string,
    now?: Date,
  ): Map<string, ScheduledMealStatus> {
    return this.assignStatuses(meals, {
      assignNext: this.isFloatingLocalToday(entryDate, now),
      now,
    });
  }

  async resolveStatusesForMeal(
    profileId: string,
    record: ScheduledMealRecord,
    now?: Date,
  ): Promise<Map<string, ScheduledMealStatus>> {
    const entryDate = formatEntryDate(record.entryDate);
    const dayRecords = this.isFloatingLocalToday(entryDate, now)
      ? await this.scheduledMealRepository.findByProfileAndDate(profileId, entryDate)
      : [record];

    return this.resolveStatuses(
      dayRecords.map((dayRecord) =>
        toScheduledMealStatusInput(dayRecord, this.scheduledMealRepository),
      ),
      entryDate,
      now,
    );
  }

  assignStatuses(
    meals: readonly ScheduledMealStatusInput[],
    options: AssignStatusesOptions = {},
  ): Map<string, ScheduledMealStatus> {
    const assignNext = options.assignNext ?? false;
    const now = options.now ?? new Date();
    const sorted = [...meals].sort((left, right) =>
      comparePlannedMoments(left.entryDate, left.plannedTime, right.entryDate, right.plannedTime),
    );

    const statuses = new Map<string, ScheduledMealStatus>();
    let nextAssigned = false;
    const { entryDate: nowDate, plannedTime: nowTime } = getFloatingLocalNowParts(now);

    for (const meal of sorted) {
      if (meal.hasMealLog) {
        statuses.set(meal.id, 'completed');
        continue;
      }

      if (comparePlannedMoments(meal.entryDate, meal.plannedTime, nowDate, nowTime) <= 0) {
        statuses.set(meal.id, 'missed');
        continue;
      }

      if (assignNext && !nextAssigned) {
        statuses.set(meal.id, 'next');
        nextAssigned = true;
        continue;
      }

      statuses.set(meal.id, 'upcoming');
    }

    return statuses;
  }
}
