export interface RhythmInsightEntity {
  readonly id: string;
  readonly type: 'meal_type' | 'time_slot' | 'tag_pattern';
  readonly icon: string;
  readonly tone: 'positive' | 'neutral';
  readonly message: string;
}
