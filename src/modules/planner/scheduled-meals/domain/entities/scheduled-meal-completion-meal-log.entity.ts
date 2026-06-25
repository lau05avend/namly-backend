import type { ScheduledMealCompletionTagEntity } from './scheduled-meal-completion-tag.entity';

export interface ScheduledMealCompletionMealLogEntity {
  readonly id: string;
  readonly mediaUrl: string | null;
  readonly loggedAt: Date;
  readonly content: string | null;
  readonly tags: readonly ScheduledMealCompletionTagEntity[];
}
