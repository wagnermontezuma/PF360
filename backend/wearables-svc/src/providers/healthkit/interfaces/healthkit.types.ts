export interface HealthKitDevice {
  name: string;
  manufacturer: string;
  model: string;
  hardwareVersion: string;
  firmwareVersion: string;
  softwareVersion: string;
  localIdentifier: string;
}

export interface HealthKitWorkout {
  uuid: string;
  workoutActivityType: string;
  startDate: string;
  endDate: string;
  duration: number;
  totalDistance: number;
  totalEnergyBurned: number;
  device: HealthKitDevice;
  metadata?: Record<string, any>;
}

export interface HealthKitQuantitySample {
  uuid: string;
  type: string;
  value: number;
  unit: string;
  startDate: string;
  endDate: string;
  device?: HealthKitDevice;
  metadata?: Record<string, any>;
}

export interface HealthKitWorkoutRoute {
  uuid: string;
  workoutUUID: string;
  locations: HealthKitLocation[];
  metadata?: Record<string, any>;
}

export interface HealthKitLocation {
  timestamp: string;
  latitude: number;
  longitude: number;
  altitude: number;
  horizontalAccuracy: number;
  verticalAccuracy: number;
  speed: number;
  course: number;
}

export interface HealthKitHeartRateSample extends HealthKitQuantitySample {
  motionContext?: 'notSet' | 'sedentary' | 'active';
}

export interface HealthKitWorkoutEvent {
  type: 'pause' | 'resume' | 'lap' | 'marker';
  date: string;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface HealthKitWorkoutDetails extends HealthKitWorkout {
  events: HealthKitWorkoutEvent[];
  heartRateSamples: HealthKitHeartRateSample[];
  route?: HealthKitWorkoutRoute;
  statistics: {
    averageHeartRate?: number;
    maxHeartRate?: number;
    averageSpeed?: number;
    maxSpeed?: number;
    totalAscent?: number;
    totalDescent?: number;
    averageCadence?: number;
    activeDuration: number;
    pauseDuration: number;
  };
} 