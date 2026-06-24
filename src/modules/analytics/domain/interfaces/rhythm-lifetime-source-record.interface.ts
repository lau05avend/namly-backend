export interface RhythmLifetimeSourceRecord {
  readonly longestStreak: number;
  readonly totalMealsLogged: number;
  readonly dailyActivities: readonly {
    readonly entryDate: string;
    readonly weekStart: string | null;
    readonly mealsPlanned: number;
    readonly completionPercentage: number | null;
  }[];
}
