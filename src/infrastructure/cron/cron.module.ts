import { Module } from '@nestjs/common';
// import { ScheduleModule } from '@nestjs/schedule'; // Uncomment when using @nestjs/schedule
import { ReminderScheduler } from './reminder.scheduler';

@Module({
  // imports: [ScheduleModule.forRoot()], // Uncomment when using @nestjs/schedule
  providers: [ReminderScheduler],
  exports: [ReminderScheduler],
})
export class CronModule {}
