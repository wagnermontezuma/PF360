import { Body, Controller, Get, Param, Patch, Post, BadRequestException, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationPreferencesService } from '../services/notification-preferences.service';
import { UpdatePreferencesDto } from '../dto/update-preferences.dto';
import { MuteNotificationsDto } from '../dto/mute-notifications.dto';
import { NotificationType, NotificationChannel } from '../enums/notification.enum';
import { UpdateChannelsDto } from '../dto/update-channels.dto';
import { ToggleTypeDto } from '../dto/toggle-type.dto';
import { UpdateManyDto } from '../dto/update-many.dto';

interface UpdateChannelsDto {
  type: NotificationType;
  channel: NotificationChannel;
  enabled: boolean;
}

interface ToggleTypeDto {
  type: NotificationType;
  enabled: boolean;
}

interface NotificationPreference {
  type: NotificationType;
  channels: NotificationChannel[];
  enabled: boolean;
}

interface UpdateManyDto {
  preferences: NotificationPreference[];
}

@ApiTags('Preferências de Notificação')
@Controller('notification-preferences')
export class NotificationPreferencesController {
  constructor(
    private readonly preferencesService: NotificationPreferencesService,
  ) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Obtém as preferências de notificação do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Preferências obtidas com sucesso',
  })
  async getPreferences(@Param('userId') userId: string) {
    const preferences = await this.preferencesService.getPreferences(userId);
    return {
      status: 'success',
      data: preferences,
    };
  }

  @Patch(':userId')
  @ApiOperation({ summary: 'Atualiza as preferências de notificação' })
  @ApiResponse({
    status: 200,
    description: 'Preferências atualizadas com sucesso',
  })
  async updatePreferences(
    @Param('userId') userId: string,
    @Body() data: UpdatePreferencesDto,
  ) {
    if (data.allowedStartTime && data.allowedEndTime) {
      if (data.allowedStartTime >= data.allowedEndTime) {
        throw new BadRequestException('O horário inicial deve ser menor que o horário final');
      }
    }

    await this.preferencesService.updatePreferences(userId, data);
    return {
      status: 'success',
      message: 'Preferências atualizadas com sucesso',
    };
  }

  @Post(':userId/mute')
  @ApiOperation({ summary: 'Silencia notificações temporariamente' })
  @ApiResponse({
    status: 200,
    description: 'Notificações silenciadas com sucesso',
  })
  async muteNotifications(
    @Param('userId') userId: string,
    @Body() data: MuteNotificationsDto,
  ) {
    await this.preferencesService.muteNotifications(userId, data.duration);
    return {
      status: 'success',
      message: 'Notificações silenciadas com sucesso',
    };
  }

  @Post(':userId/unmute')
  @ApiOperation({ summary: 'Reativa notificações' })
  @ApiResponse({
    status: 200,
    description: 'Notificações reativadas com sucesso',
  })
  async unmuteNotifications(@Param('userId') userId: string) {
    await this.preferencesService.unmuteNotifications(userId);
    return {
      status: 'success',
      message: 'Notificações reativadas com sucesso',
    };
  }

  @Put(':userId/channels')
  @ApiOperation({ summary: 'Atualiza preferência de canal para um tipo de notificação' })
  @ApiResponse({
    status: 200,
    description: 'Preferência de canal atualizada com sucesso',
  })
  async updateChannels(
    @Param('userId') userId: string,
    @Body() data: UpdateChannelsDto,
  ) {
    await this.preferencesService.updateChannels(
      userId,
      data.type,
      data.channel,
      data.enabled,
    );
    return {
      status: 'success',
      message: 'Preferência de canal atualizada com sucesso',
    };
  }

  @Put(':userId/type')
  @ApiOperation({ summary: 'Alterna estado de um tipo de notificação' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de notificação atualizado com sucesso',
  })
  async toggleType(
    @Param('userId') userId: string,
    @Body() data: ToggleTypeDto,
  ) {
    await this.preferencesService.toggleType(userId, data.type, data.enabled);
    return {
      status: 'success',
      message: 'Tipo de notificação atualizado com sucesso',
    };
  }

  @Post(':userId/batch')
  @ApiOperation({ summary: 'Atualiza múltiplas preferências de uma vez' })
  @ApiResponse({
    status: 200,
    description: 'Preferências atualizadas com sucesso',
  })
  async updateMany(
    @Param('userId') userId: string,
    @Body() data: UpdateManyDto,
  ) {
    await this.preferencesService.updateMany(userId, data.preferences);
    return {
      status: 'success',
      message: 'Preferências atualizadas com sucesso',
    };
  }
} 