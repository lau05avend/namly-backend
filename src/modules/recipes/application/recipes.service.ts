import { Injectable, NotFoundException } from '@nestjs/common';
import type { RecipeDetailCoreEntity, RecipeDetailEntity } from '../domain/entities/recipe-detail.entity';
import type { RecipeListItemEntity } from '../domain/entities/recipe-list-item.entity';
import type { RecipeListFilter } from '../domain/enums/recipe-list-filter.enum';
import type { CreateRecipeParams } from '../domain/interfaces/create-recipe-params.interface';
import type { UpdateRecipeParams } from '../domain/interfaces/update-recipe-params.interface';
import { RecipeRepository } from '../infrastructure/repositories/recipe.repository';
import { CreateRecipeUseCase } from './use-cases/create-recipe.use-case';
import { UpdateRecipeUseCase } from './use-cases/update-recipe.use-case';
import { RecipeAccessService } from './recipe-access.service';
import { RecipeCompatibilityService } from './recipe-compatibility.service';
import { RecipeFoldersService } from './recipe-folders.service';

@Injectable()
export class RecipesService {
  constructor(
    private readonly recipeRepository: RecipeRepository,
    private readonly recipeAccessService: RecipeAccessService,
    private readonly recipeFoldersService: RecipeFoldersService,
    private readonly recipeCompatibilityService: RecipeCompatibilityService,
    private readonly createRecipeUseCase: CreateRecipeUseCase,
    private readonly updateRecipeUseCase: UpdateRecipeUseCase,
  ) {}

  async listRecipes(
    profileId: string,
    filter: RecipeListFilter,
    tagIds?: readonly string[],
    folderId?: string,
    title?: string,
  ): Promise<RecipeListItemEntity[]> {
    if (folderId !== undefined) {
      await this.recipeFoldersService.assertFolderOwned(folderId, profileId);
    }

    return this.recipeRepository.findList(profileId, filter, tagIds, folderId, title);
  }

  async getRecipeById(recipeId: string, profileId: string): Promise<RecipeDetailEntity> {
    const recipe = await this.recipeRepository.findDetailById(recipeId, profileId);

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    return this.withCompatibility(profileId, recipe);
  }

  async createRecipe(profileId: string, params: CreateRecipeParams): Promise<RecipeDetailEntity> {
    const recipe = await this.createRecipeUseCase.execute(profileId, params);

    return this.withCompatibility(profileId, recipe);
  }

  async updateRecipe(
    recipeId: string,
    profileId: string,
    params: UpdateRecipeParams,
  ): Promise<RecipeDetailEntity> {
    await this.recipeAccessService.assertOwnerCanMutate(recipeId, profileId);

    const updated = await this.updateRecipeUseCase.execute(recipeId, profileId, params);

    if (!updated) {
      throw new NotFoundException('Recipe not found');
    }

    return this.withCompatibility(profileId, updated);
  }

  private async withCompatibility(
    profileId: string,
    recipe: RecipeDetailCoreEntity,
  ): Promise<RecipeDetailEntity> {
    const compatibility = await this.recipeCompatibilityService.evaluateForProfile(profileId, {
      ingredients: recipe.ingredients,
      tags: recipe.tags,
    });

    return {
      ...recipe,
      compatibility,
    };
  }

  async deleteRecipe(recipeId: string, profileId: string): Promise<void> {
    await this.recipeAccessService.assertOwnerCanMutate(recipeId, profileId);

    const deleted = await this.recipeRepository.softDelete(recipeId, profileId);

    if (!deleted) {
      throw new NotFoundException('Recipe not found');
    }
  }
}
