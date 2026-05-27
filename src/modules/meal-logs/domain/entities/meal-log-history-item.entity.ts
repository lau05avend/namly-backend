import type { MealLogMealTypeEntity } from './meal-log-meal-type.entity';

export interface MealLogHistoryItemEntity {
  readonly id: string;
  readonly mediaUrl: string;
  readonly loggedAt: Date;
  readonly loggedAtTime: string;
  readonly mealType: MealLogMealTypeEntity | null;
  readonly isLinkedToPlan: boolean;
}
