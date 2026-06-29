export interface RecipeSummaryEntity {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly coverUrl: string | null;
  readonly durationMinutes: number | null;
  readonly isPublic: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
