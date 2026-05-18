import { Module } from '@nestjs/common';
import { MealTypesService } from './application/meal-types.service';
import { MealTypeRepository } from './infrastructure/repositories/meal-type.repository';
import { MealTypesController } from './presentation/controllers/meal-types.controller';

@Module({
  controllers: [MealTypesController],
  providers: [MealTypesService, MealTypeRepository],
  exports: [MealTypesService],
})
export class MealTypesModule {}
