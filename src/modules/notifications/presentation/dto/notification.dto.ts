import { IsDate, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';
import {
  NOTIFICATION_TYPES,
  RELATED_ENTITY_TYPES,
} from '../../domain/enums/notification-type.enum';

export class NotificationDto {
  @IsUUID()
  id!: string;

  @IsIn(NOTIFICATION_TYPES)
  type!: (typeof NOTIFICATION_TYPES)[number];

  @IsString()
  title!: string;

  @IsString()
  body!: string;

  isRead!: boolean;

  @IsOptional()
  @IsDate()
  readAt!: Date | null;

  @IsOptional()
  @IsUUID()
  relatedEntityId!: string | null;

  @IsOptional()
  @IsIn(RELATED_ENTITY_TYPES)
  relatedEntityType!: (typeof RELATED_ENTITY_TYPES)[number] | null;

  @IsDate()
  createdAt!: Date;
}
