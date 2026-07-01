import type { NotificationEntity } from '../../domain/entities/notification.entity';
import { NotificationDto } from '../dto/notification.dto';

export class NotificationMapper {
  static toDto(entity: NotificationEntity): NotificationDto {
    const dto = new NotificationDto();
    dto.id = entity.id;
    dto.type = entity.type;
    dto.title = entity.title;
    dto.body = entity.body;
    dto.isRead = entity.isRead;
    dto.readAt = entity.readAt;
    dto.relatedEntityId = entity.relatedEntityId;
    dto.relatedEntityType = entity.relatedEntityType;
    dto.createdAt = entity.createdAt;
    return dto;
  }

  static toDtoList(entities: readonly NotificationEntity[]): NotificationDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
