
import { Module } from '@nestjs/common';
import { PlannerService } from './application/planner.service';
import { RemindersModule } from './reminders/reminders.module';

@Module({
  providers: [PlannerService],
  exports: [PlannerService],
  imports: [RemindersModule],
})
export class PlannerModule {}
