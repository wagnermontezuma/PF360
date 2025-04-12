import { PolarActivity, PolarActivityDetails, PolarDevice, PolarHeartRateSample, PolarLocationSample } from './polar.types';

export interface PolarApi {
  // Autenticação
  getAuthUrl(): string;
  exchangeToken(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }>;

  // Atividades
  getActivities(
    accessToken: string,
    startTime: string,
    endTime: string,
  ): Promise<PolarActivity[]>;

  getActivityDetails(
    accessToken: string,
    activityId: string,
  ): Promise<PolarActivityDetails>;

  getActivityHeartRateSamples(
    accessToken: string,
    activityId: string,
  ): Promise<PolarHeartRateSample[]>;

  getActivityLocationSamples(
    accessToken: string,
    activityId: string,
  ): Promise<PolarLocationSample[]>;

  // Dispositivos
  getUserDevices(accessToken: string): Promise<PolarDevice[]>;

  // Webhooks
  validateWebhook(
    signature: string,
    timestamp: string,
    body: string,
  ): boolean;
} 