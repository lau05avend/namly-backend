import { Module } from '@nestjs/common';
import { OnboardingModule } from '@modules/onboarding/onboarding.module';
import { TagsModule } from '@modules/tags/tags.module';
import { CreateRecipeUseCase } from './application/use-cases/create-recipe.use-case';
import { UpdateRecipeUseCase } from './application/use-cases/update-recipe.use-case';
import { RecipeAccessService } from './application/recipe-access.service';
import { RecipeCompatibilityService } from './application/recipe-compatibility.service';
import { RecipeFoldersService } from './application/recipe-folders.service';
import { RecipeInteractionsService } from './application/recipe-interactions.service';
import { RecipesService } from './application/recipes.service';
import { RecipeFolderItemRepository } from './infrastructure/repositories/recipe-folder-item.repository';
import { RecipeFolderRepository } from './infrastructure/repositories/recipe-folder.repository';
import { RecipeIngredientRepository } from './infrastructure/repositories/recipe-ingredient.repository';
import { RecipeRepository } from './infrastructure/repositories/recipe.repository';
import { RecipeStepRepository } from './infrastructure/repositories/recipe-step.repository';
import { RecipeTagLinkRepository } from './infrastructure/repositories/recipe-tag-link.repository';
import { UserRecipeInteractionRepository } from './infrastructure/repositories/user-recipe-interaction.repository';
import { RecipeFoldersController } from './presentation/controllers/recipe-folders.controller';
import { RecipeInteractionsController } from './presentation/controllers/recipe-interactions.controller';
import { RecipesController } from './presentation/controllers/recipes.controller';

@Module({
  imports: [OnboardingModule, TagsModule],
  controllers: [RecipesController, RecipeFoldersController, RecipeInteractionsController],
  providers: [
    RecipesService,
    RecipeAccessService,
    RecipeCompatibilityService,
    RecipeFoldersService,
    RecipeInteractionsService,
    CreateRecipeUseCase,
    UpdateRecipeUseCase,
    RecipeRepository,
    RecipeIngredientRepository,
    RecipeStepRepository,
    RecipeTagLinkRepository,
    RecipeFolderRepository,
    RecipeFolderItemRepository,
    UserRecipeInteractionRepository,
  ],
  exports: [RecipesService, RecipeAccessService],
})
export class RecipesModule {}
