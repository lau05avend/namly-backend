import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RemindersModule } from '@modules/planner/reminders/reminders.module';
import { ReminderScheduler } from './reminder.scheduler';

@Module({
  imports: [ScheduleModule.forRoot(), RemindersModule],
  providers: [ReminderScheduler],
  exports: [ReminderScheduler],
})
export class CronModule {}
