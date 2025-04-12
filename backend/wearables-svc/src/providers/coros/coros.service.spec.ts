import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CorosService } from './coros.service';
import { CorosActivity, CorosActivityDetails, CorosDevice, CorosHeartRate, CorosLocation } from './interfaces/coros.types';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import * as crypto from 'crypto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CorosService', () => {
  let service: CorosService;
  let configService: ConfigService;
  let httpService: HttpService;

  const mockConfig = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    redirectUri: 'http://localhost:3000/callback',
    apiBaseUrl: 'https://api.coros.com',
    authUrl: 'https://auth.coros.com',
    webhookSecret: 'test-webhook-secret',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CorosService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const parts = key.split('.');
              return parts.reduce((obj, part) => obj?.[part], {
                providers: { coros: mockConfig },
              });
            }),
          },
        },
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CorosService>(CorosService);
    configService = module.get<ConfigService>(ConfigService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAuthUrl', () => {
    it('should return correct auth URL', () => {
      const authUrl = service.getAuthUrl();
      expect(authUrl).toBe(
        'https://auth.coros.com/oauth2/authorize?client_id=test-client-id&redirect_uri=http://localhost:3000/callback&response_type=code',
      );
    });
  });

  describe('exchangeToken', () => {
    it('should exchange code for token', async () => {
      const mockCode = 'test-code';
      const mockResponse = {
        data: {
          access_token: 'test-token',
          expires_in: 3600,
        },
      };

      jest.spyOn(httpService, 'post').mockImplementationOnce(() => of(mockResponse));

      const result = await service.exchangeToken(mockCode);

      expect(httpService.post).toHaveBeenCalledWith(
        'https://auth.coros.com/oauth2/token',
        {
          grant_type: 'authorization_code',
          client_id: mockConfig.clientId,
          client_secret: mockConfig.clientSecret,
          code: mockCode,
          redirect_uri: mockConfig.redirectUri,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getActivities', () => {
    it('should return activities for time range', async () => {
      const startTime = 1234567890;
      const endTime = 1234567899;
      const mockActivities = [
        { id: 1, type: 'running' },
        { id: 2, type: 'cycling' },
      ];

      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        of({ data: { activities: mockActivities } }),
      );

      const result = await service.getActivities(startTime, endTime);

      expect(httpService.get).toHaveBeenCalledWith(
        `${mockConfig.apiBaseUrl}/activities`,
        {
          params: { startTime, endTime },
          headers: { Authorization: expect.any(String) },
        },
      );

      expect(result).toEqual(mockActivities);
    });
  });

  describe('getActivityDetails', () => {
    it('should return activity details', async () => {
      const activityId = '12345';
      const mockActivityDetails: CorosActivityDetails = {
        activityId: activityId,
        type: 'running',
        startTime: 1234567890,
        endTime: 1234571490,
        distance: 5000,
        duration: 3600,
        calories: 300,
        avgHeartRate: 150,
        maxHeartRate: 180,
        avgPace: 5.5,
        maxPace: 4.5,
        elevationGain: 100,
        elevationLoss: 100,
        heartRateSeries: [
          { timestamp: 1234567890, value: 150 },
          { timestamp: 1234567891, value: 155 }
        ],
        locationSeries: [
          { 
            timestamp: 1234567890,
            latitude: 40.7128,
            longitude: -74.0060,
            altitude: 10,
            speed: 2.5,
            heartRate: 150,
            cadence: 180,
            power: 200
          }
        ]
      };

      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        of({ data: mockActivityDetails })
      );

      const result = await service.getActivityDetails(activityId);

      expect(httpService.get).toHaveBeenCalledWith(
        `${mockConfig.apiBaseUrl}/activities/${activityId}`,
        {
          headers: { Authorization: expect.any(String) }
        }
      );

      expect(result).toEqual(mockActivityDetails);
    });

    it('should handle activity not found', async () => {
      const activityId = 'non-existent';
      
      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        of({ data: null })
      );

      const result = await service.getActivityDetails(activityId);
      expect(result).toBeNull();
    });
  });

  describe('getActivityHeartRate', () => {
    it('should return heart rate data', async () => {
      const activityId = '12345';
      const mockHeartRateData: CorosHeartRate[] = [
        { timestamp: 1234567890, value: 150 },
        { timestamp: 1234567891, value: 155 },
        { timestamp: 1234567892, value: 160 }
      ];

      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        of({ data: { heartRate: mockHeartRateData } })
      );

      const result = await service.getActivityHeartRate(activityId);

      expect(httpService.get).toHaveBeenCalledWith(
        `${mockConfig.apiBaseUrl}/activities/${activityId}/heart-rate`,
        {
          headers: { Authorization: expect.any(String) }
        }
      );

      expect(result).toEqual(mockHeartRateData);
    });

    it('should handle empty heart rate data', async () => {
      const activityId = '12345';
      
      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        of({ data: { heartRate: [] } })
      );

      const result = await service.getActivityHeartRate(activityId);
      expect(result).toEqual([]);
    });
  });

  describe('getActivityLocations', () => {
    it('should return location data', async () => {
      const activityId = '12345';
      const mockLocationData: CorosLocation[] = [
        { 
          timestamp: 1234567890,
          latitude: 40.7128,
          longitude: -74.0060,
          altitude: 10,
          speed: 2.5,
          heartRate: 150,
          cadence: 180,
          power: 200
        },
        { 
          timestamp: 1234567891,
          latitude: 40.7129,
          longitude: -74.0061,
          altitude: 11,
          speed: 2.6,
          heartRate: 152,
          cadence: 182,
          power: 205
        }
      ];

      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        of({ data: { locations: mockLocationData } })
      );

      const result = await service.getActivityLocations(activityId);

      expect(httpService.get).toHaveBeenCalledWith(
        `${mockConfig.apiBaseUrl}/activities/${activityId}/locations`,
        {
          headers: { Authorization: expect.any(String) }
        }
      );

      expect(result).toEqual(mockLocationData);
    });

    it('should handle empty location data', async () => {
      const activityId = '12345';
      
      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        of({ data: { locations: [] } })
      );

      const result = await service.getActivityLocations(activityId);
      expect(result).toEqual([]);
    });
  });

  describe('validateWebhook', () => {
    it('should validate correct webhook signature', async () => {
      const timestamp = '1234567890';
      const body = JSON.stringify({ event: 'activity.created' });
      
      const hmac = crypto.createHmac('sha256', mockConfig.webhookSecret);
      hmac.update(timestamp + body);
      const signature = hmac.digest('hex');

      const result = await service.validateWebhook(timestamp, body, signature);
      expect(result).toBe(true);
    });

    it('should reject invalid webhook signature', async () => {
      const timestamp = '1234567890';
      const body = JSON.stringify({ event: 'activity.created' });
      const invalidSignature = 'invalid-signature';

      const result = await service.validateWebhook(timestamp, body, invalidSignature);
      expect(result).toBe(false);
    });
  });

  describe('getUserDevices', () => {
    it('should return user devices', async () => {
      const mockDevices: CorosDevice[] = [
        {
          id: 'device-1',
          name: 'COROS APEX Pro',
          model: 'APEX Pro',
          firmwareVersion: '2.1.0',
          batteryLevel: 85,
          lastSyncTime: 1234567890
        },
        {
          id: 'device-2',
          name: 'COROS PACE 2',
          model: 'PACE 2',
          firmwareVersion: '1.9.5',
          batteryLevel: 92,
          lastSyncTime: 1234567891
        }
      ];

      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        of({ data: { devices: mockDevices } })
      );

      const result = await service.getUserDevices();

      expect(httpService.get).toHaveBeenCalledWith(
        `${mockConfig.apiBaseUrl}/devices`,
        {
          headers: { Authorization: expect.any(String) }
        }
      );

      expect(result).toEqual(mockDevices);
    });

    it('should handle empty devices list', async () => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        of({ data: { devices: [] } })
      );

      const result = await service.getUserDevices();

      expect(result).toEqual([]);
    });
  });

  describe('mapActivityData', () => {
    const mockCorosActivity: CorosActivityDetails = {
      id: '1',
      type: 'running',
      startTime: 1234567890,
      endTime: 1234571490,
      distance: 5000,
      duration: 3600,
      calories: 300,
      avgHeartRate: 150,
      maxHeartRate: 180,
      avgPace: 5.5,
      maxPace: 4.5,
      elevationGain: 100,
      elevationLoss: 100,
    };

    const mockHeartRateData: CorosHeartRate[] = [
      { timestamp: 1234567890, value: 150 },
      { timestamp: 1234567891, value: 155 },
    ];

    const mockLocationData: CorosLocation[] = [
      { timestamp: 1234567890, latitude: 40.7128, longitude: -74.0060, altitude: 10 },
      { timestamp: 1234567891, latitude: 40.7129, longitude: -74.0061, altitude: 11 },
    ];

    it('should map activity data correctly', () => {
      const result = service.mapActivityData(mockCorosActivity, mockHeartRateData, mockLocationData);

      expect(result).toEqual({
        id: mockCorosActivity.id,
        type: mockCorosActivity.type,
        startTime: new Date(mockCorosActivity.startTime * 1000),
        endTime: new Date(mockCorosActivity.endTime * 1000),
        duration: mockCorosActivity.duration,
        distance: mockCorosActivity.distance,
        calories: mockCorosActivity.calories,
        avgHeartRate: mockCorosActivity.avgHeartRate,
        maxHeartRate: mockCorosActivity.maxHeartRate,
        avgPace: mockCorosActivity.avgPace,
        maxPace: mockCorosActivity.maxPace,
        elevationGain: mockCorosActivity.elevationGain,
        elevationLoss: mockCorosActivity.elevationLoss,
        heartRateSeries: mockHeartRateData.map(hr => ({
          timestamp: new Date(hr.timestamp * 1000),
          value: hr.value,
        })),
        locationSeries: mockLocationData.map(loc => ({
          timestamp: new Date(loc.timestamp * 1000),
          latitude: loc.latitude,
          longitude: loc.longitude,
          altitude: loc.altitude,
        })),
      });
    });
  });
}); 