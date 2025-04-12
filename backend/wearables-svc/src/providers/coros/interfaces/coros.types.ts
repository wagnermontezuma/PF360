export interface CorosDevice {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  lastSyncTime: number;
  batteryLevel: number;
  firmwareVersion: string;
}

export interface CorosActivity {
  activityId: string;
  userId: string;
  deviceId: string;
  activityType: string;
  startTime: number;
  endTime: number;
  duration: number;
  distance: number;
  calories: number;
  avgHeartRate: number;
  maxHeartRate: number;
  avgSpeed: number;
  maxSpeed: number;
  avgPace: number;
  maxPace: number;
  totalAscent: number;
  totalDescent: number;
}

export interface CorosActivityDetails extends CorosActivity {
  laps: CorosLap[];
  zones: CorosZones;
  summary: CorosSummary;
}

export interface CorosLap {
  lapNumber: number;
  startTime: number;
  endTime: number;
  duration: number;
  distance: number;
  avgHeartRate: number;
  maxHeartRate: number;
  avgSpeed: number;
  maxSpeed: number;
}

export interface CorosZones {
  heartRate: {
    zone1: number;
    zone2: number;
    zone3: number;
    zone4: number;
    zone5: number;
  };
  speed: {
    zone1: number;
    zone2: number;
    zone3: number;
    zone4: number;
    zone5: number;
  };
}

export interface CorosSummary {
  totalTime: number;
  movingTime: number;
  pauseTime: number;
  distance: number;
  calories: number;
  avgHeartRate: number;
  maxHeartRate: number;
  avgSpeed: number;
  maxSpeed: number;
  avgPace: number;
  maxPace: number;
  totalAscent: number;
  totalDescent: number;
  avgCadence: number;
  maxCadence: number;
  avgPower: number;
  maxPower: number;
  normalizedPower: number;
  trainingLoad: number;
  intensity: number;
}

export interface CorosHeartRate {
  timestamp: number;
  value: number;
}

export interface CorosLocation {
  timestamp: number;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  heartRate: number;
  cadence: number;
  power: number;
} 