export interface RecipeInteractionEntity {
  readonly rating: number | null;
  readonly publicComment: string | null;
  readonly privateNotes: string | null;
  readonly isFavorite: boolean;
  readonly isHidden: boolean;
}
