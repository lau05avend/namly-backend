import { Module } from '@nestjs/common';
import { MealTypesModule } from '@modules/meal-types/meal-types.module';
import { RecipesModule } from '@modules/recipes/recipes.module';
import { CreateScheduledMealUseCase } from './scheduled-meals/application/use-cases/create-scheduled-meal.use-case';
import { UpdateScheduledMealUseCase } from './scheduled-meals/application/use-cases/update-scheduled-meal.use-case';
import { PlannerStatusService } from './scheduled-meals/application/planner-status.service';
import { ScheduledMealsService } from './scheduled-meals/application/scheduled-meals.service';
import { ScheduledMealRecipeRepository } from './scheduled-meals/infrastructure/repositories/scheduled-meal-recipe.repository';
import { ScheduledMealRepository } from './scheduled-meals/infrastructure/repositories/scheduled-meal.repository';
import { ScheduledMealsController } from './scheduled-meals/presentation/controllers/scheduled-meals.controller';
import { RemindersModule } from './reminders/reminders.module';

@Module({
  imports: [RemindersModule, MealTypesModule, RecipesModule],
  controllers: [ScheduledMealsController],
  providers: [
    ScheduledMealsService,
    PlannerStatusService,
    CreateScheduledMealUseCase,
    UpdateScheduledMealUseCase,
    ScheduledMealRepository,
    ScheduledMealRecipeRepository,
  ],
  exports: [ScheduledMealsService],
})
export class PlannerModule {}
