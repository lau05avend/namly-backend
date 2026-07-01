import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma/prisma.service';
import type { NotificationEntity } from '../../domain/entities/notification.entity';
import type { CreateNotificationParams } from '../../domain/interfaces/create-notification-params.interface';

const notificationSelect = {
  id: true,
  type: true,
  title: true,
  body: true,
  isRead: true,
  readAt: true,
  relatedEntityId: true,
  relatedEntityType: true,
  createdAt: true,
} as const;

type NotificationRecord = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  isRead: boolean;
  readAt: Date | null;
  relatedEntityId: string | null;
  relatedEntityType: string | null;
  createdAt: Date;
};

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateNotificationParams): Promise<NotificationEntity> {
    const record = await this.prisma.notification.create({
      data: {
        profileId: params.profileId,
        type: params.type,
        title: params.title,
        body: params.body,
        relatedEntityId: params.relatedEntityId ?? null,
        relatedEntityType: params.relatedEntityType ?? null,
      },
      select: notificationSelect,
    });

    return this.toEntity(record);
  }

  async findByProfileId(profileId: string, limit: number): Promise<NotificationEntity[]> {
    const records = await this.prisma.notification.findMany({
      where: { profileId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: notificationSelect,
    });

    return records.map((record) => this.toEntity(record));
  }

  async countUnread(profileId: string): Promise<number> {
    return this.prisma.notification.count({
      where: {
        profileId,
        isRead: false,
      },
    });
  }

  async markRead(profileId: string, notificationId: string): Promise<NotificationEntity | null> {
    const existing = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        profileId,
      },
      select: { id: true },
    });

    if (!existing) {
      return null;
    }

    const record = await this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
      select: notificationSelect,
    });

    return this.toEntity(record);
  }

  async markAllRead(profileId: string): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: {
        profileId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return result.count;
  }

  private toEntity(record: NotificationRecord): NotificationEntity {
    return {
      id: record.id,
      type: record.type as NotificationEntity['type'],
      title: record.title,
      body: record.body ?? '',
      isRead: record.isRead,
      readAt: record.readAt,
      relatedEntityId: record.relatedEntityId,
      relatedEntityType: record.relatedEntityType as NotificationEntity['relatedEntityType'],
      createdAt: record.createdAt,
    };
  }
}
