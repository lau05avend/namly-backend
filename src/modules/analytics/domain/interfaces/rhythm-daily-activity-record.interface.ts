export interface RhythmDailyActivityRecord {
  readonly entryDate: string;
  readonly weekStart: string | null;
  readonly mealsPlanned: number;
  readonly mealsRegistered: number;
  readonly completionPercentage: number | null;
  readonly countsForStreak: boolean;
}
