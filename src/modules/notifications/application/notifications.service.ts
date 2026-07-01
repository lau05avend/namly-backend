import { Injectable, NotFoundException } from '@nestjs/common';
import type { NotificationEntity } from '../domain/entities/notification.entity';
import { NotificationRepository } from '../infrastructure/repositories/notification.repository';

export type CreateMealReminderNotificationParams = {
  readonly profileId: string;
  readonly scheduledMealId: string;
  readonly title: string;
  readonly body: string;
};

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  createMealReminderNotification(
    params: CreateMealReminderNotificationParams,
  ): Promise<NotificationEntity> {
    return this.notificationRepository.create({
      profileId: params.profileId,
      type: 'meal_reminder',
      title: params.title,
      body: params.body,
      relatedEntityId: params.scheduledMealId,
      relatedEntityType: 'scheduled_meal',
    });
  }

  listNotifications(profileId: string, limit: number): Promise<NotificationEntity[]> {
    return this.notificationRepository.findByProfileId(profileId, limit);
  }

  getUnreadCount(profileId: string): Promise<number> {
    return this.notificationRepository.countUnread(profileId);
  }

  async markNotificationRead(
    profileId: string,
    notificationId: string,
  ): Promise<NotificationEntity> {
    const updated = await this.notificationRepository.markRead(profileId, notificationId);

    if (!updated) {
      throw new NotFoundException('Notification not found');
    }

    return updated;
  }

  markAllNotificationsRead(profileId: string): Promise<number> {
    return this.notificationRepository.markAllRead(profileId);
  }
}
