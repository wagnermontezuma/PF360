import { HealthKitWorkout, HealthKitWorkoutDetails, HealthKitHeartRateSample, HealthKitWorkoutRoute } from './healthkit.types';

export interface HealthKitApi {
  // Autenticação
  validateToken(token: string): Promise<boolean>;

  // Workouts
  getWorkouts(
    token: string,
    startDate: string,
    endDate: string,
  ): Promise<HealthKitWorkout[]>;

  getWorkoutDetails(
    token: string,
    workoutUUID: string,
  ): Promise<HealthKitWorkoutDetails>;

  getWorkoutHeartRateSamples(
    token: string,
    workoutUUID: string,
  ): Promise<HealthKitHeartRateSample[]>;

  getWorkoutRoute(
    token: string,
    workoutUUID: string,
  ): Promise<HealthKitWorkoutRoute>;

  // Webhooks
  validateWebhook(
    signature: string,
    timestamp: string,
    body: string,
  ): boolean;
} 