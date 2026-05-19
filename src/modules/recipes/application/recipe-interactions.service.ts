import { Injectable } from '@nestjs/common';
import type { RecipeInteractionEntity } from '../domain/entities/recipe-interaction.entity';
import type { UpsertRecipeInteractionParams } from '../domain/interfaces/upsert-recipe-interaction-params.interface';
import { UserRecipeInteractionRepository } from '../infrastructure/repositories/user-recipe-interaction.repository';
import { RecipeAccessService } from './recipe-access.service';

@Injectable()
export class RecipeInteractionsService {
  constructor(
    private readonly userRecipeInteractionRepository: UserRecipeInteractionRepository,
    private readonly recipeAccessService: RecipeAccessService,
  ) {}

  async getInteraction(recipeId: string, profileId: string): Promise<RecipeInteractionEntity> {
    await this.recipeAccessService.assertRecipeAccessible(recipeId, profileId);

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
    await this.recipeAccessService.assertRecipeAccessible(recipeId, profileId);

    return this.userRecipeInteractionRepository.upsert(recipeId, profileId, params);
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
