export interface GarminDevice {
  deviceId: string;
  userDeviceId: string;
  deviceType: string;
  model: string;
  firmware: string;
  lastSyncTime: string;
  batteryStatus: string;
}

export interface GarminActivity {
  activityId: string;
  userId: string;
  userAccessToken: string;
  deviceId: string;
  summaryId: string;
  activityType: string;
  startTimeInSeconds: number;
  startTimeOffsetInSeconds: number;
  durationInSeconds: number;
  distanceInMeters: number;
  averageSpeedInMetersPerSecond: number;
  maxSpeedInMetersPerSecond: number;
  averageHeartRateInBeatsPerMinute: number;
  maxHeartRateInBeatsPerMinute: number;
  totalElevationGainInMeters: number;
  totalElevationLossInMeters: number;
  averagePowerInWatts?: number;
  maxPowerInWatts?: number;
  averageRunningCadenceInStepsPerMinute?: number;
  maxRunningCadenceInStepsPerMinute?: number;
  averageBikingCadenceInRoundsPerMinute?: number;
  maxBikingCadenceInRoundsPerMinute?: number;
  steps?: number;
  strokes?: number;
  calories: number;
}

export interface GarminActivityDetails extends GarminActivity {
  laps: GarminLap[];
  heartRateZones: GarminHeartRateZone[];
  intensityMinutes: number;
  trainingEffect: number;
  anaerobicTrainingEffect: number;
}

export interface GarminLap {
  lapIndex: number;
  startTimeInSeconds: number;
  durationInSeconds: number;
  distanceInMeters: number;
  averageSpeedInMetersPerSecond: number;
  maxSpeedInMetersPerSecond: number;
  averageHeartRateInBeatsPerMinute: number;
  maxHeartRateInBeatsPerMinute: number;
  totalElevationGainInMeters: number;
  totalElevationLossInMeters: number;
}

export interface GarminHeartRateZone {
  zoneNumber: number;
  lowerBoundInBeatsPerMinute: number;
  upperBoundInBeatsPerMinute: number;
  durationInSeconds: number;
}

export interface GarminHeartRateData {
  timestamp: number;
  beatsPerMinute: number;
}

export interface GarminLocation {
  timestamp: number;
  latitudeInDegrees: number;
  longitudeInDegrees: number;
  elevationInMeters: number;
  speedInMetersPerSecond: number;
  heartRateInBeatsPerMinute?: number;
  powerInWatts?: number;
  cadenceInStepsPerMinute?: number;
} 