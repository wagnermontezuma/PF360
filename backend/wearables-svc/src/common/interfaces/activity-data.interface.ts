export interface Location {
  latitude: number;
  longitude: number;
  altitude?: number;
  timestamp: string;
}

export interface HeartRatePoint {
  value: number;
  timestamp: string;
}

export interface ActivityData {
  // Identificadores
  deviceId: string;
  userId: string;
  activityId: string;
  source: 'garmin' | 'healthkit' | 'polar' | 'coros';

  // Dados básicos
  type: string;
  startTime: string;
  endTime: string;
  duration: number; // em segundos
  distance?: number; // em metros
  calories?: number;

  // Métricas cardíacas
  averageHeartRate?: number;
  maxHeartRate?: number;
  minHeartRate?: number;
  heartRateZones?: {
    zone: number;
    min: number;
    max: number;
    duration: number;
  }[];
  heartRateTimeSeries?: HeartRatePoint[];

  // Métricas de ritmo/velocidade
  averagePace?: number; // min/km
  maxPace?: number;
  averageSpeed?: number; // m/s
  maxSpeed?: number;

  // Dados de GPS
  route?: Location[];
  totalAscent?: number;
  totalDescent?: number;

  // Métricas específicas
  steps?: number;
  strokes?: number; // natação
  cadence?: number; // ciclismo/corrida
  power?: number; // ciclismo
  
  // Dados adicionais
  deviceModel?: string;
  firmwareVersion?: string;
  metadata?: Record<string, any>;
} 