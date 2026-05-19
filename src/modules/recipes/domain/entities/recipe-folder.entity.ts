export interface RecipeFolderEntity {
  readonly id: string;
  readonly name: string;
  readonly colorHex: string | null;
  readonly recipesCount: number;
}
