import { Module } from '@nestjs/common';
import { MealLogsService } from './application/meal-logs.service';

@Module({
  providers: [MealLogsService],
  exports: [MealLogsService],
})
export class MealLogsModule {}
