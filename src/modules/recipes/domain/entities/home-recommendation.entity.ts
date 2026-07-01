export interface HomeRecommendationEntity {
  readonly id: string;
  readonly title: string;
  readonly meta: string;
  readonly totalDurationMinutes: number | null;
  readonly avgRating: number | null;
  readonly imageUrl: string | null;
}
