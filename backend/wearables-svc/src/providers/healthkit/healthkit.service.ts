import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { createHmac } from 'crypto';
import { HealthKitApi } from './interfaces/healthkit-api.interface';
import { HealthKitWorkout, HealthKitWorkoutDetails, HealthKitHeartRateSample, HealthKitWorkoutRoute } from './interfaces/healthkit.types';
import { ActivityData } from '../../common/interfaces/activity-data.interface';

@Injectable()
export class HealthKitService implements HealthKitApi {
  private readonly logger = new Logger(HealthKitService.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly config: {
    apiBaseUrl: string;
    webhookSecret: string;
  };

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get('providers.healthkit');
    if (!config) {
      throw new Error('Configuração do HealthKit não encontrada');
    }
    this.config = config;

    this.axiosInstance = axios.create({
      baseURL: this.config.apiBaseUrl,
      timeout: 10000,
    });
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const response = await this.axiosInstance.post('/validate-token', null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.status === 200;
    } catch (error) {
      this.logger.error('Erro ao validar token', error);
      return false;
    }
  }

  async getWorkouts(token: string, startDate: string, endDate: string): Promise<HealthKitWorkout[]> {
    try {
      const response = await this.axiosInstance.get('/workouts', {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      this.logger.error('Erro ao buscar workouts', error);
      throw error;
    }
  }

  async getWorkoutDetails(token: string, workoutUUID: string): Promise<HealthKitWorkoutDetails> {
    try {
      const response = await this.axiosInstance.get(`/workouts/${workoutUUID}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao buscar detalhes do workout ${workoutUUID}`, error);
      throw error;
    }
  }

  async getWorkoutHeartRateSamples(token: string, workoutUUID: string): Promise<HealthKitHeartRateSample[]> {
    try {
      const response = await this.axiosInstance.get(`/workouts/${workoutUUID}/heart-rate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao buscar dados cardíacos do workout ${workoutUUID}`, error);
      throw error;
    }
  }

  async getWorkoutRoute(token: string, workoutUUID: string): Promise<HealthKitWorkoutRoute> {
    try {
      const response = await this.axiosInstance.get(`/workouts/${workoutUUID}/route`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao buscar rota do workout ${workoutUUID}`, error);
      throw error;
    }
  }

  validateWebhook(signature: string, timestamp: string, body: string): boolean {
    const expectedSignature = createHmac('sha256', this.config.webhookSecret)
      .update(`${timestamp}${body}`)
      .digest('hex');

    return signature === expectedSignature;
  }

  // Método auxiliar para converter dados do HealthKit para o formato padronizado
  mapActivityData(
    workout: HealthKitWorkoutDetails,
  ): ActivityData {
    const route = workout.route?.locations.map(location => ({
      latitude: location.latitude,
      longitude: location.longitude,
      altitude: location.altitude,
      timestamp: location.timestamp,
    })) || [];

    const heartRateTimeSeries = workout.heartRateSamples.map(sample => ({
      value: sample.value,
      timestamp: sample.startDate,
    }));

    const activeDuration = workout.statistics.activeDuration;
    const totalDuration = activeDuration + workout.statistics.pauseDuration;

    return {
      deviceId: workout.device.localIdentifier,
      userId: workout.metadata?.userId as string,
      activityId: workout.uuid,
      source: 'healthkit' as const,
      type: workout.workoutActivityType,
      startDate: workout.startDate,
      endDate: workout.endDate,
      duration: totalDuration,
      distance: workout.totalDistance,
      calories: workout.totalEnergyBurned,
      averageHeartRate: workout.statistics.averageHeartRate,
      maxHeartRate: workout.statistics.maxHeartRate,
      averageSpeed: workout.statistics.averageSpeed,
      maxSpeed: workout.statistics.maxSpeed,
      route,
      totalAscent: workout.statistics.totalAscent,
      totalDescent: workout.statistics.totalDescent,
      cadence: workout.statistics.averageCadence,
      heartRateTimeSeries,
      metadata: {
        device: {
          name: workout.device.name,
          manufacturer: workout.device.manufacturer,
          model: workout.device.model,
        },
        activeDuration,
        pauseDuration: workout.statistics.pauseDuration,
        events: workout.events,
      },
    };
  }
} 