import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  MEAL_LOG_CREATED_EVENT,
  MealLogCreatedEvent,
} from '@modules/meal-logs/domain/events/meal-log-created.event';
import { ScheduledMealRemindersService } from '../scheduled-meal-reminders.service';

@Injectable()
export class ScheduledMealReminderListener {
  private readonly logger = new Logger(ScheduledMealReminderListener.name);

  constructor(private readonly scheduledMealRemindersService: ScheduledMealRemindersService) {}

  @OnEvent(MEAL_LOG_CREATED_EVENT)
  async handleMealLogCreated(event: MealLogCreatedEvent): Promise<void> {
    if (!event.scheduledMealId) {
      return;
    }

    try {
      await this.scheduledMealRemindersService.deactivateByScheduledMealId(event.scheduledMealId);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'unknown error';
      this.logger.warn(
        `Failed to deactivate reminders for scheduled meal ${event.scheduledMealId}: ${message}`,
      );
    }
  }
}
