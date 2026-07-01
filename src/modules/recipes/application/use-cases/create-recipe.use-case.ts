import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import type { RecipeDetailCoreEntity } from '../../domain/entities/recipe-detail.entity';
import type { CreateRecipeParams } from '../../domain/interfaces/create-recipe-params.interface';
import { RecipeIngredientRepository } from '../../infrastructure/repositories/recipe-ingredient.repository';
import { RecipeRepository } from '../../infrastructure/repositories/recipe.repository';
import { RecipeStepRepository } from '../../infrastructure/repositories/recipe-step.repository';
import { RecipeTagLinkRepository } from '../../infrastructure/repositories/recipe-tag-link.repository';

@Injectable()
export class CreateRecipeUseCase {
  private readonly logger = new Logger(CreateRecipeUseCase.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly recipeRepository: RecipeRepository,
    private readonly recipeIngredientRepository: RecipeIngredientRepository,
    private readonly recipeStepRepository: RecipeStepRepository,
    private readonly recipeTagLinkRepository: RecipeTagLinkRepository,
  ) {}

  async execute(profileId: string, params: CreateRecipeParams): Promise<RecipeDetailCoreEntity> {
    const recipeId = await this.prisma.$transaction(async (tx) => {
      const id = await this.recipeRepository.createRecord(tx, profileId, {
        title: params.title,
        description: params.description,
        coverUrl: params.coverUrl,
        isPublic: params.isPublic,
      });

      await this.recipeIngredientRepository.createMany(tx, id, params.ingredients);
      await this.recipeStepRepository.createMany(tx, id, params.steps);
      await this.recipeTagLinkRepository.createMany(tx, id, params.tagIds);

      return id;
    });

    const detail = await this.recipeRepository.findDetailById(recipeId, profileId);

    if (!detail) {
      // TODO: mirar a futuro si globalizar loggers de e
      this.logger.error(
        `Recipe ${recipeId} was created but could not be loaded for profile ${profileId}`,
      );
      throw new InternalServerErrorException('Recipe was created but could not be loaded');
    }

    return detail;
  }
}
