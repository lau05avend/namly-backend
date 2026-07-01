export interface HomeMealTypeEntity {
  readonly id: string;
  readonly name: string;
  readonly sortOrder: number;
}

export interface HomeScheduledMealItemEntity {
  readonly id: string;
  readonly label: string;
}

export interface HomeScheduledMealEntity {
  readonly id: string;
  readonly mealType: HomeMealTypeEntity;
  readonly entryDate: string;
  readonly plannedTime: string;
  readonly plannedTimeLabel: string;
  readonly isExpress: boolean;
  readonly title: string;
  readonly items: readonly HomeScheduledMealItemEntity[];
  readonly moreCount: number;
}
