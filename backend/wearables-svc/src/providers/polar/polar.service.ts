import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { createHmac } from 'crypto';
import { PolarApi } from './interfaces/polar-api.interface';
import { PolarActivity, PolarActivityDetails, PolarDevice, PolarHeartRateSample, PolarLocationSample } from './interfaces/polar.types';
import { ActivityData } from '../../common/interfaces/activity-data.interface';

@Injectable()
export class PolarService implements PolarApi {
  private readonly logger = new Logger(PolarService.name);
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
    const config = this.configService.get('providers.polar');
    if (!config) {
      throw new Error('Configuração da Polar não encontrada');
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

  async getActivities(accessToken: string, startTime: string, endTime: string): Promise<PolarActivity[]> {
    try {
      const response = await this.axiosInstance.get('/v3/activities', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { start_time: startTime, end_time: endTime },
      });

      return response.data;
    } catch (error) {
      this.logger.error('Erro ao buscar atividades', error);
      throw error;
    }
  }

  async getActivityDetails(accessToken: string, activityId: string): Promise<PolarActivityDetails> {
    try {
      const response = await this.axiosInstance.get(`/v3/activities/${activityId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao buscar detalhes da atividade ${activityId}`, error);
      throw error;
    }
  }

  async getActivityHeartRateSamples(accessToken: string, activityId: string): Promise<PolarHeartRateSample[]> {
    try {
      const response = await this.axiosInstance.get(`/v3/activities/${activityId}/heart-rate`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao buscar dados cardíacos da atividade ${activityId}`, error);
      throw error;
    }
  }

  async getActivityLocationSamples(accessToken: string, activityId: string): Promise<PolarLocationSample[]> {
    try {
      const response = await this.axiosInstance.get(`/v3/activities/${activityId}/location`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao buscar localizações da atividade ${activityId}`, error);
      throw error;
    }
  }

  async getUserDevices(accessToken: string): Promise<PolarDevice[]> {
    try {
      const response = await this.axiosInstance.get('/v3/devices', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      return response.data;
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

  // Método auxiliar para converter dados da Polar para o formato padronizado
  mapActivityData(
    polarActivity: PolarActivityDetails,
  ): ActivityData {
    const route = polarActivity.locationSamples.map(location => ({
      latitude: location.latitude,
      longitude: location.longitude,
      altitude: location.altitude,
      timestamp: location.timestamp,
    }));

    const heartRateTimeSeries = polarActivity.heartRateSamples.map(sample => ({
      value: sample.heartRate,
      timestamp: sample.timestamp,
    }));

    return {
      deviceId: polarActivity.deviceId,
      userId: polarActivity.userId,
      activityId: polarActivity.id,
      source: 'polar' as const,
      type: 'unknown', // Tipo de atividade não especificado
      startDate: polarActivity.startTime,
      endDate: new Date(new Date(polarActivity.startTime).getTime() + polarActivity.duration * 1000).toISOString(),
      duration: polarActivity.duration,
      distance: polarActivity.distance,
      calories: polarActivity.calories,
      averageHeartRate: polarActivity.averageHeartRate,
      maxHeartRate: polarActivity.maxHeartRate,
      averageSpeed: polarActivity.averageSpeed,
      maxSpeed: polarActivity.maxSpeed,
      route,
      totalAscent: polarActivity.totalAscent,
      totalDescent: polarActivity.totalDescent,
      heartRateTimeSeries,
      metadata: {},
    };
  }
} 