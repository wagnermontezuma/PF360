import { Controller, Get, Post, Body, Query, Headers, UseGuards, UnauthorizedException, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GarminService } from './garmin.service';
import { SyncActivityDto } from '../../sync/dto/sync-activity.dto';
import { LinkDeviceDto } from '../../devices/dto/link-device.dto';

@ApiTags('Garmin')
@Controller('garmin')
export class GarminController {
  private readonly logger = new Logger(GarminController.name);

  constructor(private readonly garminService: GarminService) {}

  @Get('auth/url')
  @ApiOperation({ summary: 'Obter URL de autorização' })
  @ApiResponse({ status: 200, description: 'URL de autorização gerada com sucesso' })
  getAuthUrl() {
    return {
      url: this.garminService.getAuthorizationUrl(),
    };
  }

  @Post('auth/callback')
  @ApiOperation({ summary: 'Callback de autorização' })
  @ApiResponse({ status: 200, description: 'Tokens obtidos com sucesso' })
  async handleCallback(@Query('code') code: string) {
    try {
      return await this.garminService.exchangeToken(code);
    } catch (error) {
      this.logger.error('Erro no callback de autorização', error);
      throw error;
    }
  }

  @Post('auth/refresh')
  @ApiOperation({ summary: 'Atualizar token de acesso' })
  @ApiResponse({ status: 200, description: 'Token atualizado com sucesso' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    try {
      return await this.garminService.refreshAccessToken(refreshToken);
    } catch (error) {
      this.logger.error('Erro ao atualizar token', error);
      throw error;
    }
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook para receber atualizações' })
  @ApiResponse({ status: 200, description: 'Webhook processado com sucesso' })
  async handleWebhook(
    @Headers('x-webhook-signature') signature: string,
    @Body() payload: any,
  ) {
    if (!this.garminService.validateWebhook(signature, payload)) {
      throw new UnauthorizedException('Assinatura do webhook inválida');
    }

    // TODO: Processar payload do webhook
    this.logger.log('Webhook recebido', payload);
    return { success: true };
  }

  @Get('devices')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar dispositivos do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de dispositivos obtida com sucesso' })
  async getUserDevices(@Headers('authorization') auth: string) {
    const accessToken = auth.replace('Bearer ', '');
    return await this.garminService.getUserDevices(accessToken);
  }

  @Post('devices/link')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Vincular dispositivo' })
  @ApiResponse({ status: 200, description: 'Dispositivo vinculado com sucesso' })
  async linkDevice(@Body() linkDeviceDto: LinkDeviceDto) {
    // TODO: Implementar vinculação de dispositivo
    return { success: true };
  }

  @Post('activities/sync')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sincronizar atividades' })
  @ApiResponse({ status: 200, description: 'Atividades sincronizadas com sucesso' })
  async syncActivities(@Body() syncActivityDto: SyncActivityDto) {
    try {
      const { accessToken, startDate, endDate } = syncActivityDto;
      const activities = await this.garminService.getActivities(
        accessToken,
        new Date(startDate),
        new Date(endDate),
      );

      if (!activities.success) {
        return activities;
      }

      // Para cada atividade, buscar detalhes adicionais
      const detailedActivities = await Promise.all(
        activities.data.map(async (activity) => {
          const [details, heartRate, locations] = await Promise.all([
            this.garminService.getActivityDetails(accessToken, activity.activityId),
            this.garminService.getActivityHeartRate(accessToken, activity.activityId),
            this.garminService.getActivityLocations(accessToken, activity.activityId),
          ]);

          if (details.success) {
            return this.garminService.mapActivityData(
              details.data,
              heartRate.success ? heartRate.data : undefined,
              locations.success ? locations.data : undefined,
            );
          }
          return null;
        }),
      );

      return {
        success: true,
        data: detailedActivities.filter(Boolean),
      };
    } catch (error) {
      this.logger.error('Erro ao sincronizar atividades', error);
      return {
        success: false,
        error: {
          code: 'SYNC_ERROR',
          message: error.message,
        },
      };
    }
  }
} 