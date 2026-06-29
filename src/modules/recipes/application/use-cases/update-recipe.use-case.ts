import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import { computeStoredRecipeTotalDurationMinutes } from '../../domain/utils/resolve-recipe-total-duration-minutes.util';
import type { RecipeDetailEntity } from '../../domain/entities/recipe-detail.entity';
import type { UpdateRecipeParams } from '../../domain/interfaces/update-recipe-params.interface';
import { RecipeIngredientRepository } from '../../infrastructure/repositories/recipe-ingredient.repository';
import { RecipeRepository } from '../../infrastructure/repositories/recipe.repository';
import { RecipeStepRepository } from '../../infrastructure/repositories/recipe-step.repository';
import { RecipeTagLinkRepository } from '../../infrastructure/repositories/recipe-tag-link.repository';

@Injectable()
export class UpdateRecipeUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly recipeRepository: RecipeRepository,
    private readonly recipeIngredientRepository: RecipeIngredientRepository,
    private readonly recipeStepRepository: RecipeStepRepository,
    private readonly recipeTagLinkRepository: RecipeTagLinkRepository,
  ) {}

  async execute(
    recipeId: string,
    profileId: string,
    params: UpdateRecipeParams,
  ): Promise<RecipeDetailEntity | null> {
    const updated = await this.prisma.$transaction(async (tx) => {
      const owned = await this.recipeRepository.isOwnedInTransaction(tx, recipeId, profileId);

      if (!owned) {
        return false;
      }

      await this.recipeRepository.updateRecord(tx, recipeId, {
        title: params.title,
        description: params.description,
        coverUrl: params.coverUrl,
        isPublic: params.isPublic,
      });

      if (params.ingredients !== undefined) {
        await this.recipeIngredientRepository.sync(tx, recipeId, params.ingredients);
      }

      if (params.steps !== undefined) {
        await this.recipeStepRepository.sync(tx, recipeId, params.steps);
        await this.recipeRepository.updateTotalDurationMinutes(
          tx,
          recipeId,
          computeStoredRecipeTotalDurationMinutes(
            params.steps.map((step) => step.durationMinutes),
          ),
        );
      }

      if (params.tagIds !== undefined) {
        await this.recipeTagLinkRepository.sync(tx, recipeId, params.tagIds);
      }

      return true;
    });

    if (!updated) {
      return null;
    }

    return this.recipeRepository.findDetailById(recipeId, profileId);
  }
}
