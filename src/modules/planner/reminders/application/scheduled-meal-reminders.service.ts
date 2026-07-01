import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import {
  type ScheduledMealReminderInput,
  validateScheduledMealReminders,
} from '../domain/rules/validate-scheduled-meal-reminders.util';
import { ScheduledMealReminderRepository } from '../infrastructure/repositories/scheduled-meal-reminder.repository';

@Injectable()
export class ScheduledMealRemindersService {
  constructor(private readonly scheduledMealReminderRepository: ScheduledMealReminderRepository) {}

  assertValidReminders(reminders: readonly ScheduledMealReminderInput[] | undefined): void {
    const validationError = validateScheduledMealReminders(reminders);

    if (validationError) {
      throw new BadRequestException(validationError);
    }
  }

  async syncForScheduledMeal(
    tx: Prisma.TransactionClient,
    scheduledMealId: string,
    reminders: readonly ScheduledMealReminderInput[] | undefined,
  ): Promise<void> {
    if (reminders === undefined) {
      return;
    }

    const offsetMinutesList = reminders.map((reminder) => reminder.offsetMinutes);

    await this.scheduledMealReminderRepository.syncForScheduledMeal(
      tx,
      scheduledMealId,
      offsetMinutesList,
    );
  }

  deactivateByScheduledMealId(scheduledMealId: string): Promise<void> {
    return this.scheduledMealReminderRepository.deactivateByScheduledMealId(scheduledMealId);
  }
}
