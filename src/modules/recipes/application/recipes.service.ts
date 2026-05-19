import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { RecipeDetailEntity } from '../domain/entities/recipe-detail.entity';
import type { RecipeInteractionEntity } from '../domain/entities/recipe-interaction.entity';
import type { RecipeListItemEntity } from '../domain/entities/recipe-list-item.entity';
import type { RecipeListFilter } from '../domain/enums/recipe-list-filter.enum';
import type { CreateRecipeParams } from '../domain/interfaces/create-recipe-params.interface';
import type { UpdateRecipeParams } from '../domain/interfaces/update-recipe-params.interface';
import type { UpsertRecipeInteractionParams } from '../domain/interfaces/upsert-recipe-interaction-params.interface';
import { RecipeRepository } from '../infrastructure/repositories/recipe.repository';
import { UserRecipeInteractionRepository } from '../infrastructure/repositories/user-recipe-interaction.repository';
import { CreateRecipeUseCase } from './use-cases/create-recipe.use-case';
import { UpdateRecipeUseCase } from './use-cases/update-recipe.use-case';

@Injectable()
export class RecipesService {
  constructor(
    private readonly recipeRepository: RecipeRepository,
    private readonly userRecipeInteractionRepository: UserRecipeInteractionRepository,
    private readonly createRecipeUseCase: CreateRecipeUseCase,
    private readonly updateRecipeUseCase: UpdateRecipeUseCase,
  ) {}

  listRecipes(
    profileId: string,
    filter: RecipeListFilter,
    tagIds?: readonly string[],
  ): Promise<RecipeListItemEntity[]> {
    return this.recipeRepository.findList(profileId, filter, tagIds);
  }

  async getRecipeById(recipeId: string, profileId: string): Promise<RecipeDetailEntity> {
    const recipe = await this.recipeRepository.findDetailById(recipeId, profileId);

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return recipe;
  }

  createRecipe(profileId: string, params: CreateRecipeParams): Promise<RecipeDetailEntity> {
    return this.createRecipeUseCase.execute(profileId, params);
  }

  async updateRecipe(
    recipeId: string,
    profileId: string,
    params: UpdateRecipeParams,
  ): Promise<RecipeDetailEntity> {
    await this.assertOwnerCanMutate(recipeId, profileId);

    const updated = await this.updateRecipeUseCase.execute(recipeId, profileId, params);

    if (!updated) {
      throw new NotFoundException('Recipe not found');
    }

    return updated;
  }

  async deleteRecipe(recipeId: string, profileId: string): Promise<void> {
    await this.assertOwnerCanMutate(recipeId, profileId);

    const deleted = await this.recipeRepository.softDelete(recipeId, profileId);

    if (!deleted) {
      throw new NotFoundException('Recipe not found');
    }
  }

  async getInteraction(recipeId: string, profileId: string): Promise<RecipeInteractionEntity> {
    await this.assertRecipeAccessible(recipeId, profileId);

    const interaction = await this.userRecipeInteractionRepository.findByRecipeAndProfile(
      recipeId,
      profileId,
    );

    return interaction ?? this.defaultInteraction();
  }

  async upsertInteraction(
    recipeId: string,
    profileId: string,
    params: UpsertRecipeInteractionParams,
  ): Promise<RecipeInteractionEntity> {
    await this.assertRecipeAccessible(recipeId, profileId);

    return this.userRecipeInteractionRepository.upsert(recipeId, profileId, params);
  }

  private async assertRecipeAccessible(recipeId: string, profileId: string): Promise<void> {
    const accessible = await this.recipeRepository.isAccessible(recipeId, profileId);

    if (!accessible) {
      throw new NotFoundException('Recipe not found');
    }
  }

  private async assertOwnerCanMutate(recipeId: string, profileId: string): Promise<void> {
    const owned = await this.recipeRepository.findOwnedById(recipeId, profileId);

    if (!owned) {
      throw new NotFoundException('Recipe not found');
    }

    if (owned.isSuggested) {
      throw new ForbiddenException('Suggested recipes are read-only');
    }
  }

  private defaultInteraction(): RecipeInteractionEntity {
    return {
      rating: null,
      publicComment: null,
      privateNotes: null,
      isFavorite: false,
      isHidden: false,
    };
  }
}
