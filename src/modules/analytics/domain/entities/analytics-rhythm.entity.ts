import type { RhythmHabitsEntity } from './rhythm-habits.entity';
import type { RhythmLifetimeEntity } from './rhythm-lifetime.entity';
import type { RhythmWeekEntity } from './rhythm-week.entity';

export interface AnalyticsRhythmEntity {
  readonly week: RhythmWeekEntity;
  readonly habits: RhythmHabitsEntity;
  readonly lifetime: RhythmLifetimeEntity;
}
