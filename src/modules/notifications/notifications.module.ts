import { Module } from '@nestjs/common';
import { NotificationsService } from './application/notifications.service';
import { NotificationRepository } from './infrastructure/repositories/notification.repository';
import { NotificationsController } from './presentation/controllers/notifications.controller';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationRepository],
  exports: [NotificationsService],
})
export class NotificationsModule {}
