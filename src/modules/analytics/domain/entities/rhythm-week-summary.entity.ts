export interface RhythmWeekSummaryEntity {
  readonly level: 'stable' | 'active' | 'irregular' | 'quiet';
  readonly tone: 'positive' | 'neutral';
  readonly message: string;
}
