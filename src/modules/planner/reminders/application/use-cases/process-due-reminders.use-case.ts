import { Injectable, Logger } from '@nestjs/common';
import { NotificationsService } from '@modules/notifications/application/notifications.service';
import { buildMealReminderNotificationContent } from '../../domain/utils/build-meal-reminder-notification-content.util';
import { resolveReminderDueAt } from '../../domain/utils/resolve-reminder-due-at.util';
import { ScheduledMealReminderRepository } from '../../infrastructure/repositories/scheduled-meal-reminder.repository';

@Injectable()
export class ProcessDueRemindersUseCase {
  private readonly logger = new Logger(ProcessDueRemindersUseCase.name);

  constructor(
    private readonly scheduledMealReminderRepository: ScheduledMealReminderRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  async execute(now: Date = new Date()): Promise<number> {
    const candidates = await this.scheduledMealReminderRepository.findDueCandidates();
    let processedCount = 0;

    for (const candidate of candidates) {
      const dueAt = resolveReminderDueAt(
        candidate.scheduledMeal.entryDate,
        candidate.scheduledMeal.plannedTime,
        candidate.offsetMinutes,
      );

      if (dueAt > now) {
        continue;
      }

      const marked = await this.scheduledMealReminderRepository.markNotified(candidate.id);

      if (!marked) {
        continue;
      }

      const recipeTitles = candidate.scheduledMeal.isExpress
        ? []
        : candidate.scheduledMeal.scheduledMealRecipes.map((item) => item.recipe.title);

      const content = buildMealReminderNotificationContent({
        mealTypeName: candidate.scheduledMeal.mealType.name,
        offsetMinutes: candidate.offsetMinutes,
        recipeTitles,
        expressNote: candidate.scheduledMeal.expressNote,
        isExpress: candidate.scheduledMeal.isExpress,
      });

      try {
        await this.notificationsService.createMealReminderNotification({
          profileId: candidate.scheduledMeal.profileId,
          scheduledMealId: candidate.scheduledMeal.id,
          title: content.title,
          body: content.body,
        });
        processedCount += 1;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'unknown error';
        this.logger.error(`Failed to create notification for reminder ${candidate.id}: ${message}`);
      }
    }

    return processedCount;
  }
}
