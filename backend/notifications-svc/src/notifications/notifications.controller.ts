import { Controller, Get, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('health')
  @ApiOperation({ summary: 'Verifica o status do serviço' })
  @ApiResponse({ status: 200, description: 'Serviço está funcionando corretamente' })
  healthCheck() {
    return { status: 'ok', service: 'notifications-service' };
  }

  @Post('send')
  @ApiOperation({ summary: 'Envia uma notificação' })
  @ApiResponse({ status: 201, description: 'Notificação enviada com sucesso' })
  async sendNotification(
    @Body() payload: { userId: string; title: string; content: string; type: 'EMAIL' | 'PUSH' | 'SMS' | 'IN_APP' }
  ) {
    await this.notificationsService.sendNotification(payload);
    return { status: 'success', message: 'Notification sent successfully' };
  }
} 