import type { TimeSlotDistribution } from '../constants/time-slot.constants';
import type { RhythmInsightEntity } from './rhythm-insight.entity';

export interface RhythmHabitsEntity {
  readonly insights: readonly RhythmInsightEntity[];
  readonly timeSlotDistribution: TimeSlotDistribution;
}
