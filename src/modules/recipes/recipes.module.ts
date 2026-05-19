import { Module } from '@nestjs/common';
import { CreateRecipeUseCase } from './application/use-cases/create-recipe.use-case';
import { UpdateRecipeUseCase } from './application/use-cases/update-recipe.use-case';
import { RecipesService } from './application/recipes.service';
import { RecipeIngredientRepository } from './infrastructure/repositories/recipe-ingredient.repository';
import { RecipeRepository } from './infrastructure/repositories/recipe.repository';
import { RecipeStepRepository } from './infrastructure/repositories/recipe-step.repository';
import { RecipeTagLinkRepository } from './infrastructure/repositories/recipe-tag-link.repository';
import { UserRecipeInteractionRepository } from './infrastructure/repositories/user-recipe-interaction.repository';
import { RecipesController } from './presentation/controllers/recipes.controller';

@Module({
  controllers: [RecipesController],
  providers: [
    RecipesService,
    CreateRecipeUseCase,
    UpdateRecipeUseCase,
    RecipeRepository,
    RecipeIngredientRepository,
    RecipeStepRepository,
    RecipeTagLinkRepository,
    UserRecipeInteractionRepository,
  ],
  exports: [RecipesService],
})
export class RecipesModule {}
