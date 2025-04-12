import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PolarService } from './polar.service';
import { PolarActivity, PolarActivityDetails } from './interfaces/polar.types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PolarService', () => {
  let service: PolarService;
  let configService: ConfigService;

  const mockConfig = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    redirectUri: 'http://localhost:3000/callback',
    apiBaseUrl: 'https://api.polar.com',
    authUrl: 'https://auth.polar.com',
    webhookSecret: 'test-webhook-secret',
  };

  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    create: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolarService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(mockConfig),
          },
        },
      ],
    }).compile();

    service = module.get<PolarService>(PolarService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAuthUrl', () => {
    it('should return correct auth URL with params', () => {
      const authUrl = service.getAuthUrl();
      const url = new URL(authUrl);
      
      expect(url.origin).toBe(mockConfig.authUrl);
      expect(url.searchParams.get('client_id')).toBe(mockConfig.clientId);
      expect(url.searchParams.get('redirect_uri')).toBe(mockConfig.redirectUri);
      expect(url.searchParams.get('response_type')).toBe('code');
      expect(url.searchParams.get('scope')).toBe('activity profile');
    });
  });

  describe('exchangeToken', () => {
    const mockCode = 'test-auth-code';
    const mockTokenResponse = {
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      expires_in: 3600,
    };

    it('should exchange auth code for tokens', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockTokenResponse });

      const result = await service.exchangeToken(mockCode);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/oauth2/token', {
        grant_type: 'authorization_code',
        client_id: mockConfig.clientId,
        client_secret: mockConfig.clientSecret,
        code: mockCode,
        redirect_uri: mockConfig.redirectUri,
      });

      expect(result).toEqual({
        accessToken: mockTokenResponse.access_token,
        refreshToken: mockTokenResponse.refresh_token,
        expiresIn: mockTokenResponse.expires_in,
      });
    });

    it('should throw error when token exchange fails', async () => {
      const error = new Error('Token exchange failed');
      mockAxiosInstance.post.mockRejectedValueOnce(error);

      await expect(service.exchangeToken(mockCode)).rejects.toThrow(error);
    });
  });

  describe('getActivities', () => {
    const mockAccessToken = 'test-access-token';
    const mockStartTime = '2024-01-01T00:00:00Z';
    const mockEndTime = '2024-01-02T00:00:00Z';
    const mockActivities: PolarActivity[] = [
      {
        id: 'activity-1',
        userId: 'user-1',
        deviceId: 'device-1',
        startTime: mockStartTime,
        duration: 3600,
        distance: 5000,
        calories: 500,
        averageHeartRate: 140,
        maxHeartRate: 180,
        averageSpeed: 2.5,
        maxSpeed: 3.5,
        totalAscent: 100,
        totalDescent: 100,
      },
    ];

    it('should fetch activities for given time range', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockActivities });

      const result = await service.getActivities(mockAccessToken, mockStartTime, mockEndTime);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v3/activities', {
        headers: { Authorization: `Bearer ${mockAccessToken}` },
        params: { start_time: mockStartTime, end_time: mockEndTime },
      });

      expect(result).toEqual(mockActivities);
    });
  });

  describe('validateWebhook', () => {
    it('should validate webhook signature correctly', () => {
      const timestamp = '2024-01-01T00:00:00Z';
      const body = '{"event":"activity_created"}';
      const signature = 'valid-signature';

      const result = service.validateWebhook(signature, timestamp, body);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('mapActivityData', () => {
    const mockActivityDetails: PolarActivityDetails = {
      id: 'activity-1',
      userId: 'user-1',
      deviceId: 'device-1',
      startTime: '2024-01-01T00:00:00Z',
      duration: 3600,
      distance: 5000,
      calories: 500,
      averageHeartRate: 140,
      maxHeartRate: 180,
      averageSpeed: 2.5,
      maxSpeed: 3.5,
      totalAscent: 100,
      totalDescent: 100,
      heartRateSamples: [
        { timestamp: '2024-01-01T00:00:00Z', heartRate: 140 },
      ],
      locationSamples: [
        {
          timestamp: '2024-01-01T00:00:00Z',
          latitude: 0,
          longitude: 0,
          altitude: 100,
          speed: 2.5,
        },
      ],
    };

    it('should map Polar activity data to standard format', () => {
      const result = service.mapActivityData(mockActivityDetails);

      expect(result).toMatchObject({
        deviceId: mockActivityDetails.deviceId,
        userId: mockActivityDetails.userId,
        activityId: mockActivityDetails.id,
        source: 'polar',
        startDate: mockActivityDetails.startTime,
        duration: mockActivityDetails.duration,
        distance: mockActivityDetails.distance,
        calories: mockActivityDetails.calories,
        averageHeartRate: mockActivityDetails.averageHeartRate,
        maxHeartRate: mockActivityDetails.maxHeartRate,
        averageSpeed: mockActivityDetails.averageSpeed,
        maxSpeed: mockActivityDetails.maxSpeed,
        totalAscent: mockActivityDetails.totalAscent,
        totalDescent: mockActivityDetails.totalDescent,
      });

      expect(result.route).toHaveLength(1);
      expect(result.heartRateTimeSeries).toHaveLength(1);
    });
  });
}); 