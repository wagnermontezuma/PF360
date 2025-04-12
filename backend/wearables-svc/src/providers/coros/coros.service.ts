import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { createHmac } from 'crypto';
import { CorosApi } from './interfaces/coros-api.interface';
import { CorosActivity, CorosActivityDetails, CorosDevice, CorosHeartRate, CorosLocation } from './interfaces/coros.types';
import { ActivityData } from '../../common/interfaces/activity-data.interface';
import { ApiResponse } from '../../common/interfaces/api-response.interface';

@Injectable()
export class CorosService implements CorosApi {
  private readonly logger = new Logger(CorosService.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly config: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    apiBaseUrl: string;
    authUrl: string;
    webhookSecret: string;
  };

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get('providers.coros');
    if (!config) {
      throw new Error('Configuração da Coros não encontrada');
    }
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: this.config.apiBaseUrl,
      timeout: 10000,
    });
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: 'activity profile',
    });

    return `${this.config.authUrl}?${params.toString()}`;
  }

  async exchangeToken(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    try {
      const response = await this.axiosInstance.post('/oauth2/token', {
        grant_type: 'authorization_code',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        redirect_uri: this.config.redirectUri,
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error) {
      this.logger.error('Erro ao trocar código por token', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    try {
      const response = await this.axiosInstance.post('/oauth2/token', {
        grant_type: 'refresh_token',
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        refresh_token: refreshToken,
      });

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error) {
      this.logger.error('Erro ao atualizar token', error);
      throw error;
    }
  }

  async getActivities(accessToken: string, startTime: number, endTime: number): Promise<CorosActivity[]> {
    try {
      const response = await this.axiosInstance.get('/v2/activity/list', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { start_time: startTime, end_time: endTime },
      });

      return response.data.activities;
    } catch (error) {
      this.logger.error('Erro ao buscar atividades', error);
      throw error;
    }
  }

  async getActivityDetails(accessToken: string, activityId: string): Promise<CorosActivityDetails> {
    try {
      const response = await this.axiosInstance.get(`/v2/activity/${activityId}/details`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao buscar detalhes da atividade ${activityId}`, error);
      throw error;
    }
  }

  async getActivityHeartRate(accessToken: string, activityId: string): Promise<CorosHeartRate[]> {
    try {
      const response = await this.axiosInstance.get(`/v2/activity/${activityId}/heart-rate`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.heartRatePoints;
    } catch (error) {
      this.logger.error(`Erro ao buscar dados cardíacos da atividade ${activityId}`, error);
      throw error;
    }
  }

  async getActivityLocations(accessToken: string, activityId: string): Promise<CorosLocation[]> {
    try {
      const response = await this.axiosInstance.get(`/v2/activity/${activityId}/locations`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.points;
    } catch (error) {
      this.logger.error(`Erro ao buscar localizações da atividade ${activityId}`, error);
      throw error;
    }
  }

  async getUserDevices(accessToken: string): Promise<CorosDevice[]> {
    try {
      const response = await this.axiosInstance.get('/v2/devices', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data.devices;
    } catch (error) {
      this.logger.error('Erro ao buscar dispositivos do usuário', error);
      throw error;
    }
  }

  validateWebhook(signature: string, timestamp: string, body: string): boolean {
    const expectedSignature = createHmac('sha256', this.config.webhookSecret)
      .update(`${timestamp}${body}`)
      .digest('hex');

    return signature === expectedSignature;
  }

  // Método auxiliar para converter dados da Coros para o formato padronizado
  mapActivityData(corosActivity: CorosActivity, heartRate?: CorosHeartRate[], locations?: CorosLocation[]): ActivityData {
    const route = locations?.map(point => ({
      latitude: point.latitude,
      longitude: point.longitude,
      altitude: point.altitude,
      timestamp: new Date(point.timestamp * 1000).toISOString(),
    })) || [];

    const heartRateTimeSeries = heartRate?.map(hr => ({
      value: hr.value,
      timestamp: new Date(hr.timestamp * 1000).toISOString(),
    })) || [];

    return {
      deviceId: corosActivity.deviceId,
      userId: corosActivity.userId,
      activityId: corosActivity.activityId,
      source: 'coros' as const,
      type: corosActivity.activityType,
      startTime: new Date(corosActivity.startTime * 1000).toISOString(),
      endTime: new Date(corosActivity.endTime * 1000).toISOString(),
      duration: corosActivity.duration,
      distance: corosActivity.distance,
      calories: corosActivity.calories,
      averageHeartRate: corosActivity.avgHeartRate,
      maxHeartRate: corosActivity.maxHeartRate,
      averageSpeed: corosActivity.avgSpeed,
      maxSpeed: corosActivity.maxSpeed,
      route,
      totalAscent: corosActivity.totalAscent,
      totalDescent: corosActivity.totalDescent,
      heartRateTimeSeries,
      metadata: {
        intensity: corosActivity.intensity,
      },
    };
  }
} 