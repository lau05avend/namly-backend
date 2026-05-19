import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class FolderRecipesDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  recipeIds!: string[];
}
