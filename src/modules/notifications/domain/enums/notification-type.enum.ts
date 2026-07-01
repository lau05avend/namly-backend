export const NOTIFICATION_TYPES = ['meal_reminder'] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const RELATED_ENTITY_TYPES = ['scheduled_meal'] as const;

export type RelatedEntityType = (typeof RELATED_ENTITY_TYPES)[number];
