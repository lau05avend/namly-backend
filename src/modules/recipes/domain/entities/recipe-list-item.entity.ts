export interface RecipeListItemEntity {
  readonly id: string;
  readonly title: string;
  readonly coverUrl: string | null;
  readonly rating: number | null;
  readonly isFavorite: boolean;
  readonly isHidden: boolean;
  readonly updatedAt: Date;
  readonly createdAt: Date;
}
