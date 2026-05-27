import { Module } from '@nestjs/common';
import { PlannerModule } from '@modules/planner/planner.module';
import { MealTypesModule } from '@modules/meal-types/meal-types.module';
import { RecipesModule } from '@modules/recipes/recipes.module';
import { TagsModule } from '@modules/tags/tags.module';
import { MealLogsService } from './application/meal-logs.service';
import { CreateMealLogUseCase } from './application/use-cases/create-meal-log.use-case';
import { UpdateMealLogUseCase } from './application/use-cases/update-meal-log.use-case';
import { MealLogRecipeRepository } from './infrastructure/repositories/meal-log-recipe.repository';
import { MealLogRepository } from './infrastructure/repositories/meal-log.repository';
import { MealLogTagLinkRepository } from './infrastructure/repositories/meal-log-tag-link.repository';
import { MealLogsController } from './presentation/controllers/meal-logs.controller';

@Module({
  imports: [PlannerModule, MealTypesModule, RecipesModule, TagsModule],
  controllers: [MealLogsController],
  providers: [
    MealLogsService,
    CreateMealLogUseCase,
    UpdateMealLogUseCase,
    MealLogRepository,
    MealLogRecipeRepository,
    MealLogTagLinkRepository,
  ],
  exports: [MealLogsService],
})
export class MealLogsModule {}
