import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProcessDueRemindersUseCase } from '@modules/planner/reminders/application/use-cases/process-due-reminders.use-case';

@Injectable()
export class ReminderScheduler {
  private readonly logger = new Logger(ReminderScheduler.name);

  constructor(private readonly processDueRemindersUseCase: ProcessDueRemindersUseCase) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleDueReminders(): Promise<void> {
    try {
      const processedCount = await this.processDueRemindersUseCase.execute();

      if (processedCount > 0) {
        this.logger.log(`Processed ${processedCount} due meal reminder(s)`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'unknown error';
      this.logger.error(`Failed to process due meal reminders: ${message}`);
    }
  }
}
