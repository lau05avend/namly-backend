import { Module } from '@nestjs/common';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { ScheduledMealRemindersService } from './application/scheduled-meal-reminders.service';
import { ScheduledMealReminderListener } from './application/listeners/scheduled-meal-reminder.listener';
import { ProcessDueRemindersUseCase } from './application/use-cases/process-due-reminders.use-case';
import { ScheduledMealReminderRepository } from './infrastructure/repositories/scheduled-meal-reminder.repository';

@Module({
  imports: [NotificationsModule],
  providers: [
    ScheduledMealReminderRepository,
    ScheduledMealRemindersService,
    ProcessDueRemindersUseCase,
    ScheduledMealReminderListener,
  ],
  exports: [ScheduledMealRemindersService, ProcessDueRemindersUseCase],
})
export class RemindersModule {}
