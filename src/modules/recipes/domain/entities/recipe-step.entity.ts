export interface RecipeStepEntity {
  readonly id: string;
  readonly stepOrder: number;
  readonly description: string;
  readonly durationMinutes: number | null;
}
