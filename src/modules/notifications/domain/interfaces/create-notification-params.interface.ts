import type { NotificationType, RelatedEntityType } from '../enums/notification-type.enum';

export type CreateNotificationParams = {
  readonly profileId: string;
  readonly type: NotificationType;
  readonly title: string;
  readonly body: string;
  readonly relatedEntityId?: string | null;
  readonly relatedEntityType?: RelatedEntityType | null;
};
