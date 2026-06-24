import type { RhythmWeekComparisonEntity } from './rhythm-week-comparison.entity';
import type { RhythmWeekDayEntity } from './rhythm-week-day.entity';
import type { RhythmWeekSummaryEntity } from './rhythm-week-summary.entity';

export interface RhythmWeekEntity {
  readonly weekStart: string;
  readonly weekEnd: string;
  readonly summary: RhythmWeekSummaryEntity;
  readonly activeDays: number;
  readonly totalDays: number;
  readonly averageCompletion: number;
  readonly comparison: RhythmWeekComparisonEntity;
  readonly days: readonly RhythmWeekDayEntity[];
}
