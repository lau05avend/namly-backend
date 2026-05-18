import { Module } from '@nestjs/common';
import { RecipesService } from './application/recipes.service';
import { RecipeFoldersModule } from './recipe-folders/recipe-folders.module';
import { RecipeIngredientsModule } from './recipe-ingredients/recipe-ingredients.module';
import { RecipeStepsModule } from './recipe-steps/recipe-steps.module';
import { RecipeInteractionsModule } from './recipe-interactions/recipe-interactions.module';

@Module({
  providers: [RecipesService],
  exports: [RecipesService],
  imports: [
    RecipeFoldersModule,
    RecipeIngredientsModule,
    RecipeStepsModule,
    RecipeInteractionsModule,
  ],
})
export class RecipesModule {}
