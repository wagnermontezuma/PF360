import { ApiResponse } from '../../../common/interfaces/api-response.interface';
import { CorosActivity, CorosActivityDetails, CorosDevice, CorosHeartRate, CorosLocation } from './coros.types';

export interface CorosActivity {
  activityId: string;
  activityType: string;
  startTime: number;
  duration: number;
  distance?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  avgSpeed?: number;
  maxSpeed?: number;
  avgPower?: number;
  maxPower?: number;
  elevationGain?: number;
  elevationLoss?: number;
  avgCadence?: number;
  calories?: number;
  deviceId?: string;
  deviceModel?: string;
  trainingLoad?: number;
  aerobicTE?: number;
  anaerobicTE?: number;
}

export interface CorosHeartRateData {
  heartRatePoints: Array<{
    timestamp: number;
    value: number;
  }>;
}

export interface CorosLocationData {
  points: Array<{
    timestamp: number;
    latitude: number;
    longitude: number;
    elevation?: number;
    speed?: number;
  }>;
}

export interface CorosDevice {
  deviceId: string;
  model: string;
  firmwareVersion?: string;
  batteryLevel?: number;
  lastSyncTime?: number;
}

export interface CorosApi {
  // Autenticação
  getAuthUrl(): string;
  exchangeToken(code: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }>;
  refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }>;

  // Atividades
  getActivities(accessToken: string, startTime: number, endTime: number): Promise<CorosActivity[]>;
  getActivityDetails(accessToken: string, activityId: string): Promise<CorosActivityDetails>;
  getActivityHeartRate(accessToken: string, activityId: string): Promise<CorosHeartRate[]>;
  getActivityLocations(accessToken: string, activityId: string): Promise<CorosLocation[]>;

  // Dispositivos
  getUserDevices(accessToken: string): Promise<CorosDevice[]>;
  
  // Webhook
  validateWebhook(signature: string, timestamp: string, body: string): boolean;
} 