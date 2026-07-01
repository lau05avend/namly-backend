import type { NotificationType, RelatedEntityType } from '../enums/notification-type.enum';

export interface NotificationEntity {
  readonly id: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly body: string;
  readonly isRead: boolean;
  readonly readAt: Date | null;
  readonly relatedEntityId: string | null;
  readonly relatedEntityType: RelatedEntityType | null;
  readonly createdAt: Date;
}
