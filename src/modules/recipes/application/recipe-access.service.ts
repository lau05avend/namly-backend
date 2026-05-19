import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RecipeRepository } from '../infrastructure/repositories/recipe.repository';

@Injectable()
export class RecipeAccessService {
  constructor(private readonly recipeRepository: RecipeRepository) {}

  async assertRecipeAccessible(recipeId: string, profileId: string): Promise<void> {
    const accessible = await this.recipeRepository.isAccessible(recipeId, profileId);

    if (!accessible) {
      throw new NotFoundException('Recipe not found');
    }
  }

  async assertOwnerCanMutate(recipeId: string, profileId: string): Promise<void> {
    const owned = await this.recipeRepository.findOwnedById(recipeId, profileId);

    if (!owned) {
      throw new NotFoundException('Recipe not found');
    }

    if (owned.isSuggested) {
      throw new ForbiddenException('Suggested recipes are read-only');
    }
  }
}
