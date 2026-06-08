import { Injectable } from '@nestjs/common';
import type { StreakStateParams } from '../../domain/interfaces/upsert-streak-params.interface';
import { resolveCurrentStreakQualifyingDateRange } from '../../domain/utils/resolve-current-streak-qualifying-range.util';
import type { StreakAffectedDateCategory } from '../../domain/utils/streak-affected-date-category.util';
import {
  computeCurrentStreakFromQualifyingDates,
  computeLongestStreakFromQualifyingDates,
  isSameStreakState,
  mergeStreakState,
  promoteLongestStreakFromCurrent,
} from '../../domain/utils/streak-recompute.util';
import { UserDailyActivityRepository } from '../../infrastructure/repositories/user-daily-activity.repository';
import { UserStreakRepository } from '../../infrastructure/repositories/user-streak.repository';

export type RecalculateStreakOptions = {
  recalculateCurrent: boolean;
  recalculateLongest: boolean;
  /** Compare longest against recomputed current (create path); no history scan. */
  promoteLongestFromCurrent?: boolean;
  /** When set with {@link category}, current-streak reads can be scoped to the active chain. */
  affectedDate?: string;
  category?: StreakAffectedDateCategory;
};

@Injectable()
export class RecalculateStreakUseCase {
  constructor(
    private readonly userDailyActivityRepository: UserDailyActivityRepository,
    private readonly userStreakRepository: UserStreakRepository,
  ) {}

  async execute(profileId: string, options: RecalculateStreakOptions): Promise<void> {
    if (!options.recalculateCurrent && !options.recalculateLongest) {
      return;
    }

    const existing = await this.userStreakRepository.findByProfileId(profileId);

    const [currentQualifyingDates, longestQualifyingDates] = await Promise.all([
      options.recalculateCurrent
        ? this.loadQualifyingDatesForCurrent(profileId, options, existing)
        : Promise.resolve(null),
      options.recalculateLongest
        ? this.loadQualifyingDatesForLongest(profileId, options)
        : Promise.resolve(null),
    ]);

    const updated = this.buildUpdatedState(
      existing,
      currentQualifyingDates,
      longestQualifyingDates,
      options,
    );

    if (isSameStreakState(existing, updated)) {
      return;
    }

    await this.userStreakRepository.upsertForProfile(profileId, updated);
  }

  private async loadQualifyingDatesForCurrent(
    profileId: string,
    options: RecalculateStreakOptions,
    existing: StreakStateParams | null,
  ): Promise<string[]> {
    const scopedRange = this.resolveCurrentRange(options, existing);

    if (scopedRange === 'full_history') {
      return this.userDailyActivityRepository.findAllQualifyingEntryDatesForProfile(profileId);
    }

    return this.userDailyActivityRepository.findQualifyingEntryDatesInRange(
      profileId,
      scopedRange.startDate,
      scopedRange.endDate,
    );
  }

  private async loadQualifyingDatesForLongest(
    profileId: string,
    options: RecalculateStreakOptions,
  ): Promise<string[]> {
    if (options.category === 'no_active_chain' && options.affectedDate) {
      return this.userDailyActivityRepository.findQualifyingEntryDatesInRange(
        profileId,
        options.affectedDate,
        options.affectedDate,
      );
    }

    return this.userDailyActivityRepository.findAllQualifyingEntryDatesForProfile(profileId);
  }

  private resolveCurrentRange(
    options: RecalculateStreakOptions,
    existing: StreakStateParams | null,
  ): ReturnType<typeof resolveCurrentStreakQualifyingDateRange> {
    if (options.affectedDate && options.category) {
      return resolveCurrentStreakQualifyingDateRange(
        options.affectedDate,
        options.category,
        existing,
      );
    }

    return 'full_history';
  }

  private buildUpdatedState(
    existing: StreakStateParams | null,
    currentQualifyingDates: string[] | null,
    longestQualifyingDates: string[] | null,
    options: RecalculateStreakOptions,
  ): StreakStateParams {
    if (options.recalculateCurrent && options.recalculateLongest) {
      const datesForLongest = longestQualifyingDates ?? [];
      const datesForCurrent = currentQualifyingDates ?? datesForLongest;

      const current = computeCurrentStreakFromQualifyingDates(datesForCurrent);
      const longestStreak = computeLongestStreakFromQualifyingDates(datesForLongest);

      return {
        ...current,
        longestStreak,
      };
    }

    if (options.recalculateCurrent && currentQualifyingDates) {
      const current = computeCurrentStreakFromQualifyingDates(currentQualifyingDates);

      if (options.promoteLongestFromCurrent) {
        return {
          ...current,
          longestStreak: promoteLongestStreakFromCurrent(existing, current),
        };
      }

      return mergeStreakState(existing, current, null);
    }

    if (options.recalculateLongest && longestQualifyingDates) {
      const longestStreak = computeLongestStreakFromQualifyingDates(longestQualifyingDates);
      return mergeStreakState(existing, null, longestStreak);
    }

    return (
      existing ?? {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        currentStreakStartDate: null,
      }
    );
  }
}
