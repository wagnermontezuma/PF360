export interface PolarDevice {
  id: string;
  name: string;
  model: string;
  firmwareVersion: string;
  lastSyncTime: string;
}

export interface PolarActivity {
  id: string;
  userId: string;
  deviceId: string;
  startTime: string;
  duration: number;
  distance: number;
  calories: number;
  averageHeartRate: number;
  maxHeartRate: number;
  averageSpeed: number;
  maxSpeed: number;
  totalAscent: number;
  totalDescent: number;
}

export interface PolarActivityDetails extends PolarActivity {
  heartRateSamples: PolarHeartRateSample[];
  locationSamples: PolarLocationSample[];
}

export interface PolarHeartRateSample {
  timestamp: string;
  heartRate: number;
}

export interface PolarLocationSample {
  timestamp: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
} 