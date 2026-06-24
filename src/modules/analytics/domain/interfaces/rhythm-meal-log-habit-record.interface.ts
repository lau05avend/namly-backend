export interface RhythmMealLogHabitRecord {
  readonly loggedAt: Date;
  readonly mealTypeName: string | null;
  readonly tagNames: readonly string[];
}
