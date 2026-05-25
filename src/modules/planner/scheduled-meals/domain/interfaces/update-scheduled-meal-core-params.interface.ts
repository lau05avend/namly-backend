export interface UpdateScheduledMealCoreParams {
  mealTypeId?: string;
  entryDate?: Date;
  plannedTime?: Date;
  isExpress?: boolean;
  expressNote?: string | null;
}
