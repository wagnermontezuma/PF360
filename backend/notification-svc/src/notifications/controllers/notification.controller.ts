import { Controller, Post, Get, Body, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { NotificationService } from '../services/notification.service';
import { SendNotificationDto } from '../dto/send-notification.dto';
import { NotificationType, NotificationStatus } from '../enums/notification.enum';

@ApiTags('Notificações')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  @ApiOperation({ summary: 'Envia uma nova notificação' })
  @ApiResponse({ 
    status: 201, 
    description: 'Notificação enviada com sucesso',
    schema: {
      properties: {
        status: {
          type: 'string',
          enum: Object.values(NotificationStatus),
        },
      },
    },
  })
  async sendNotification(@Body() data: SendNotificationDto) {
    return this.notificationService.sendNotification(data);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lista notificações de um usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificações retornada com sucesso',
  })
  async getUserNotifications(
    @Param('userId') userId: string,
    @Query('type') type?: NotificationType,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.notificationService.getUserNotifications(userId, {
      type,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get('unread/:userId')
  @ApiOperation({ summary: 'Retorna contagem de notificações não lidas' })
  @ApiResponse({
    status: 200,
    description: 'Contagem retornada com sucesso',
    schema: {
      properties: {
        count: {
          type: 'number',
          example: 5,
        },
      },
    },
  })
  async getUnreadCount(@Param('userId') userId: string) {
    return this.notificationService.getUnreadCount(userId);
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Marca uma notificação como lida' })
  @ApiResponse({
    status: 200,
    description: 'Notificação marcada como lida com sucesso',
  })
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Post('read-all/:userId')
  @ApiOperation({ summary: 'Marca todas as notificações do usuário como lidas' })
  @ApiResponse({
    status: 200,
    description: 'Notificações marcadas como lidas com sucesso',
  })
  async markAllAsRead(@Param('userId') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }
} 