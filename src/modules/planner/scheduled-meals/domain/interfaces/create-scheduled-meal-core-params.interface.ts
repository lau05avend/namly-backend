export interface CreateScheduledMealCoreParams {
  mealTypeId: string;
  entryDate: Date;
  plannedTime: Date;
  isExpress: boolean;
  expressNote: string | null;
}
