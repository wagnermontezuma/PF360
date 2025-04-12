import { GarminActivity, GarminActivityDetails, GarminDevice, GarminHeartRateData, GarminLocation } from './garmin.types';

export interface GarminActivity {
  activityId: string;
  activityType: string;
  startTimeInSeconds: number;
  durationInSeconds: number;
  distanceInMeters?: number;
  averageHeartRateInBeatsPerMinute?: number;
  maxHeartRateInBeatsPerMinute?: number;
  averageSpeedInMetersPerSecond?: number;
  maxSpeedInMetersPerSecond?: number;
  averagePowerInWatts?: number;
  maxPowerInWatts?: number;
  totalElevationGainInMeters?: number;
  totalElevationLossInMeters?: number;
  averageCadenceInRoundsPerMinute?: number;
  calories?: number;
  deviceId?: string;
  deviceModel?: string;
}

export interface GarminHeartRateData {
  heartRateValues: Array<{
    timestamp: number;
    beatsPerMinute: number;
  }>;
}

export interface GarminLocationData {
  locations: Array<{
    timestamp: number;
    latitudeInDegree: number;
    longitudeInDegree: number;
    elevationInMeters?: number;
  }>;
}

export interface GarminApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface GarminApi {
  // Autenticação OAuth 1.0a
  getRequestToken(): Promise<{
    token: string;
    tokenSecret: string;
    callbackConfirmed: boolean;
  }>;

  getAuthUrl(requestToken: string): string;

  exchangeToken(requestToken: string, requestTokenSecret: string, verifier: string): Promise<{
    accessToken: string;
    accessTokenSecret: string;
    userId: string;
  }>;

  // Atividades
  getActivities(
    accessToken: string,
    accessTokenSecret: string,
    startTime: number,
    endTime: number,
  ): Promise<GarminActivity[]>;

  getActivityDetails(
    accessToken: string,
    accessTokenSecret: string,
    activityId: string,
  ): Promise<GarminActivityDetails>;

  getActivityHeartRate(
    accessToken: string,
    accessTokenSecret: string,
    activityId: string,
  ): Promise<GarminHeartRateData[]>;

  getActivityLocations(
    accessToken: string,
    accessTokenSecret: string,
    activityId: string,
  ): Promise<GarminLocation[]>;

  // Dispositivos
  getUserDevices(
    accessToken: string,
    accessTokenSecret: string,
  ): Promise<GarminDevice[]>;

  // Webhooks
  validateWebhook(
    signature: string,
    timestamp: string,
    body: string,
  ): boolean;
} 