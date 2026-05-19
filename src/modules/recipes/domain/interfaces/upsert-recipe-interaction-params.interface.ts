export interface UpsertRecipeInteractionParams {
  rating?: number | null;
  publicComment?: string | null;
  privateNotes?: string | null;
  isFavorite?: boolean;
  isHidden?: boolean;
}
