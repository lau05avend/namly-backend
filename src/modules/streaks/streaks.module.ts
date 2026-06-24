import { Module } from '@nestjs/common';
import { MealLogsModule } from '@modules/meal-logs/meal-logs.module';
import { PlannerModule } from '@modules/planner/planner.module';
import { DailyActivityListener } from './application/listeners/daily-activity.listener';
import { StreaksReadService } from './application/streaks-read.service';
import { RecalculateStreakUseCase } from './application/use-cases/recalculate-streak.use-case';
import { SyncDailyActivityForDateUseCase } from './application/use-cases/sync-daily-activity-for-date.use-case';
import { HandleMealLogCreatedUseCase } from './application/use-cases/handlers/handle-meal-log-created.use-case';
import { HandleMealLogDeletedUseCase } from './application/use-cases/handlers/handle-meal-log-deleted.use-case';
import { HandleMealLogUpdatedUseCase } from './application/use-cases/handlers/handle-meal-log-updated.use-case';
import { HandleScheduledMealCreatedUseCase } from './application/use-cases/handlers/handle-scheduled-meal-created.use-case';
import { HandleScheduledMealDeletedUseCase } from './application/use-cases/handlers/handle-scheduled-meal-deleted.use-case';
import { HandleScheduledMealUpdatedUseCase } from './application/use-cases/handlers/handle-scheduled-meal-updated.use-case';
import { UserDailyActivityRepository } from './infrastructure/repositories/user-daily-activity.repository';
import { StreaksReadRepository } from './infrastructure/repositories/streaks-read.repository';
import { UserStreakRepository } from './infrastructure/repositories/user-streak.repository';

@Module({
  imports: [PlannerModule, MealLogsModule],
  providers: [
    UserDailyActivityRepository,
    UserStreakRepository,
    StreaksReadRepository,
    StreaksReadService,
    SyncDailyActivityForDateUseCase,
    RecalculateStreakUseCase,
    HandleMealLogCreatedUseCase,
    HandleMealLogUpdatedUseCase,
    HandleMealLogDeletedUseCase,
    HandleScheduledMealCreatedUseCase,
    HandleScheduledMealUpdatedUseCase,
    HandleScheduledMealDeletedUseCase,
    DailyActivityListener,
  ],
  exports: [StreaksReadService],
})
export class StreaksModule {}
