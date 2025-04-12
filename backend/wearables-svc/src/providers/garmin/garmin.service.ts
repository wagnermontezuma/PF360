import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { createHmac } from 'crypto';
import { OAuth } from 'oauth';
import { GarminApi } from './interfaces/garmin-api.interface';
import { GarminActivity, GarminActivityDetails, GarminDevice, GarminHeartRateData, GarminLocation } from './interfaces/garmin.types';
import { ActivityData } from '../../common/interfaces/activity-data.interface';

@Injectable()
export class GarminService implements GarminApi {
  private readonly logger = new Logger(GarminService.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly oauth: OAuth;
  private readonly config: {
    consumerKey: string;
    consumerSecret: string;
    redirectUri: string;
    apiBaseUrl: string;
    authUrl: string;
    webhookSecret: string;
  };

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get('providers.garmin');
    if (!config) {
      throw new Error('Configuração da Garmin não encontrada');
    }
    this.config = config;

    this.axiosInstance = axios.create({
      baseURL: this.config.apiBaseUrl,
      timeout: 10000,
    });

    this.oauth = new OAuth(
      `${this.config.apiBaseUrl}/oauth/request_token`,
      `${this.config.apiBaseUrl}/oauth/access_token`,
      this.config.consumerKey,
      this.config.consumerSecret,
      '1.0',
      this.config.redirectUri,
      'HMAC-SHA1'
    );
  }

  async getRequestToken(): Promise<{
    token: string;
    tokenSecret: string;
    callbackConfirmed: boolean;
  }> {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthRequestToken((error, token, tokenSecret, results) => {
        if (error) {
          this.logger.error('Erro ao obter request token', error);
          reject(error);
        } else {
          resolve({
            token,
            tokenSecret,
            callbackConfirmed: results.oauth_callback_confirmed === 'true',
          });
        }
      });
    });
  }

  getAuthUrl(requestToken: string): string {
    return `${this.config.authUrl}?oauth_token=${requestToken}`;
  }

  async exchangeToken(
    requestToken: string,
    requestTokenSecret: string,
    verifier: string,
  ): Promise<{
    accessToken: string;
    accessTokenSecret: string;
    userId: string;
  }> {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthAccessToken(
        requestToken,
        requestTokenSecret,
        verifier,
        (error, accessToken, accessTokenSecret, results) => {
          if (error) {
            this.logger.error('Erro ao trocar token', error);
            reject(error);
          } else {
            resolve({
              accessToken,
              accessTokenSecret,
              userId: results.user_id,
            });
          }
        },
      );
    });
  }

  async getActivities(
    accessToken: string,
    accessTokenSecret: string,
    startTime: number,
    endTime: number,
  ): Promise<GarminActivity[]> {
    return new Promise((resolve, reject) => {
      this.oauth.get(
        `${this.config.apiBaseUrl}/activities?startTime=${startTime}&endTime=${endTime}`,
        accessToken,
        accessTokenSecret,
        (error, data) => {
          if (error) {
            this.logger.error('Erro ao buscar atividades', error);
            reject(error);
          } else {
            resolve(JSON.parse(data.toString()));
          }
        },
      );
    });
  }

  async getActivityDetails(
    accessToken: string,
    accessTokenSecret: string,
    activityId: string,
  ): Promise<GarminActivityDetails> {
    return new Promise((resolve, reject) => {
      this.oauth.get(
        `${this.config.apiBaseUrl}/activities/${activityId}/details`,
        accessToken,
        accessTokenSecret,
        (error, data) => {
          if (error) {
            this.logger.error(`Erro ao buscar detalhes da atividade ${activityId}`, error);
            reject(error);
          } else {
            resolve(JSON.parse(data.toString()));
          }
        },
      );
    });
  }

  async getActivityHeartRate(
    accessToken: string,
    accessTokenSecret: string,
    activityId: string,
  ): Promise<GarminHeartRateData[]> {
    return new Promise((resolve, reject) => {
      this.oauth.get(
        `${this.config.apiBaseUrl}/activities/${activityId}/heart-rate`,
        accessToken,
        accessTokenSecret,
        (error, data) => {
          if (error) {
            this.logger.error(`Erro ao buscar dados cardíacos da atividade ${activityId}`, error);
            reject(error);
          } else {
            resolve(JSON.parse(data.toString()));
          }
        },
      );
    });
  }

  async getActivityLocations(
    accessToken: string,
    accessTokenSecret: string,
    activityId: string,
  ): Promise<GarminLocation[]> {
    return new Promise((resolve, reject) => {
      this.oauth.get(
        `${this.config.apiBaseUrl}/activities/${activityId}/locations`,
        accessToken,
        accessTokenSecret,
        (error, data) => {
          if (error) {
            this.logger.error(`Erro ao buscar localizações da atividade ${activityId}`, error);
            reject(error);
          } else {
            resolve(JSON.parse(data.toString()));
          }
        },
      );
    });
  }

  async getUserDevices(
    accessToken: string,
    accessTokenSecret: string,
  ): Promise<GarminDevice[]> {
    return new Promise((resolve, reject) => {
      this.oauth.get(
        `${this.config.apiBaseUrl}/devices`,
        accessToken,
        accessTokenSecret,
        (error, data) => {
          if (error) {
            this.logger.error('Erro ao buscar dispositivos do usuário', error);
            reject(error);
          } else {
            resolve(JSON.parse(data.toString()));
          }
        },
      );
    });
  }

  validateWebhook(signature: string, timestamp: string, body: string): boolean {
    const expectedSignature = createHmac('sha256', this.config.webhookSecret)
      .update(`${timestamp}${body}`)
      .digest('hex');

    return signature === expectedSignature;
  }

  // Método auxiliar para converter dados da Garmin para o formato padronizado
  mapActivityData(
    garminActivity: GarminActivity,
    heartRate?: GarminHeartRateData[],
    locations?: GarminLocation[],
  ): ActivityData {
    const route = locations?.map(point => ({
      latitude: point.latitudeInDegrees,
      longitude: point.longitudeInDegrees,
      altitude: point.elevationInMeters,
      timestamp: new Date(point.timestamp * 1000).toISOString(),
    })) || [];

    const heartRateTimeSeries = heartRate?.map(hr => ({
      value: hr.beatsPerMinute,
      timestamp: new Date(hr.timestamp * 1000).toISOString(),
    })) || [];

    return {
      deviceId: garminActivity.deviceId,
      userId: garminActivity.userId,
      activityId: garminActivity.activityId,
      source: 'garmin' as const,
      type: garminActivity.activityType,
      startTime: new Date(garminActivity.startTimeInSeconds * 1000).toISOString(),
      endTime: new Date((garminActivity.startTimeInSeconds + garminActivity.durationInSeconds) * 1000).toISOString(),
      duration: garminActivity.durationInSeconds,
      distance: garminActivity.distanceInMeters,
      calories: garminActivity.calories,
      averageHeartRate: garminActivity.averageHeartRateInBeatsPerMinute,
      maxHeartRate: garminActivity.maxHeartRateInBeatsPerMinute,
      averageSpeed: garminActivity.averageSpeedInMetersPerSecond,
      maxSpeed: garminActivity.maxSpeedInMetersPerSecond,
      route,
      totalAscent: garminActivity.totalElevationGainInMeters,
      totalDescent: garminActivity.totalElevationLossInMeters,
      steps: garminActivity.steps,
      strokes: garminActivity.strokes,
      cadence: garminActivity.averageRunningCadenceInStepsPerMinute || garminActivity.averageBikingCadenceInRoundsPerMinute,
      power: garminActivity.averagePowerInWatts,
      heartRateTimeSeries,
      metadata: {
        summaryId: garminActivity.summaryId,
        startTimeOffset: garminActivity.startTimeOffsetInSeconds,
      },
    };
  }
} 