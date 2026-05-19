export interface UpdateRecipeStepParams {
  id?: string;
  stepOrder: number;
  description: string;
  durationMinutes?: number | null;
}
