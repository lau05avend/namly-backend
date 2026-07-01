import { Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CurrentProfileId } from '@common/decorators/current-profile-id.decorator';
import { ApiProtectedTag } from '@/docs/swagger/decorators/api-protected.decorator';
import { SwaggerExamples } from '@/docs/swagger/swagger.examples';
import { ApiUuidParam } from '@/docs/swagger/decorators/api-uuid-param.decorator';
import { ApiStandardMutationResponses } from '@/docs/swagger/decorators/api-standard-responses.decorator';
import { NotificationsService } from '../../application/notifications.service';
import { ListNotificationsQueryDto } from '../dto/list-notifications-query.dto';
import { MarkAllNotificationsReadResultDto } from '../dto/mark-all-notifications-read-result.dto';
import { NotificationUnreadCountDto } from '../dto/notification-unread-count.dto';
import { NotificationDto } from '../dto/notification.dto';
import { NotificationMapper } from '../mappers/notification.mapper';

@ApiProtectedTag('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar notificaciones in-app del usuario' })
  @ApiOkResponse({ type: NotificationDto, isArray: true })
  @ApiStandardMutationResponses()
  async listNotifications(
    @CurrentProfileId() profileId: string,
    @Query() query: ListNotificationsQueryDto,
  ): Promise<NotificationDto[]> {
    const notifications = await this.notificationsService.listNotifications(
      profileId,
      query.limit,
    );

    return NotificationMapper.toDtoList(notifications);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Contar notificaciones no leídas' })
  @ApiOkResponse({ type: NotificationUnreadCountDto })
  @ApiStandardMutationResponses()
  async getUnreadCount(@CurrentProfileId() profileId: string): Promise<NotificationUnreadCountDto> {
    const count = await this.notificationsService.getUnreadCount(profileId);
    const dto = new NotificationUnreadCountDto();
    dto.count = count;
    return dto;
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas' })
  @ApiOkResponse({ type: MarkAllNotificationsReadResultDto })
  @ApiStandardMutationResponses()
  async markAllRead(
    @CurrentProfileId() profileId: string,
  ): Promise<MarkAllNotificationsReadResultDto> {
    const updatedCount = await this.notificationsService.markAllNotificationsRead(profileId);
    const dto = new MarkAllNotificationsReadResultDto();
    dto.updatedCount = updatedCount;
    return dto;
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  @ApiUuidParam('id', 'ID de la notificación', SwaggerExamples.uuid.scheduledMeal)
  @ApiOkResponse({ type: NotificationDto })
  @ApiStandardMutationResponses()
  async markRead(
    @CurrentProfileId() profileId: string,
    @Param('id', ParseUUIDPipe) notificationId: string,
  ): Promise<NotificationDto> {
    const notification = await this.notificationsService.markNotificationRead(
      profileId,
      notificationId,
    );

    return NotificationMapper.toDto(notification);
  }
}
