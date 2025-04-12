import { Test, TestingModule } from '@nestjs/testing';
import { CorosController } from './coros.controller';
import { CorosService } from './coros.service';
import { ConfigService } from '@nestjs/config';

describe('CorosController', () => {
  let controller: CorosController;
  let service: CorosService;

  const mockCorosService = {
    getAuthUrl: jest.fn(),
    exchangeToken: jest.fn(),
    getActivities: jest.fn(),
    getActivityDetails: jest.fn(),
    validateWebhook: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorosController],
      providers: [
        {
          provide: CorosService,
          useValue: mockCorosService,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'providers.coros.redirectUri') {
                return 'http://localhost:3000/callback';
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<CorosController>(CorosController);
    service = module.get<CorosService>(CorosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('authorize', () => {
    it('should redirect to Coros auth URL', () => {
      const mockAuthUrl = 'https://auth.coros.com/oauth2/authorize';
      mockCorosService.getAuthUrl.mockReturnValue(mockAuthUrl);

      const response = {
        redirect: jest.fn(),
      };

      controller.authorize(response as any);

      expect(service.getAuthUrl).toHaveBeenCalled();
      expect(response.redirect).toHaveBeenCalledWith(mockAuthUrl);
    });
  });

  describe('callback', () => {
    it('should exchange code for token', async () => {
      const mockCode = 'test-code';
      const mockToken = { access_token: 'test-token', expires_in: 3600 };
      mockCorosService.exchangeToken.mockResolvedValue(mockToken);

      const result = await controller.callback(mockCode);

      expect(service.exchangeToken).toHaveBeenCalledWith(mockCode);
      expect(result).toEqual({
        status: 'success',
        data: mockToken,
        message: 'Token obtido com sucesso',
      });
    });
  });

  describe('webhook', () => {
    it('should validate and process webhook', async () => {
      const mockTimestamp = '1234567890';
      const mockBody = JSON.stringify({ event: 'activity.created' });
      const mockSignature = 'test-signature';

      mockCorosService.validateWebhook.mockResolvedValue(true);

      const result = await controller.webhook(mockTimestamp, mockSignature, mockBody);

      expect(service.validateWebhook).toHaveBeenCalledWith(mockTimestamp, mockBody, mockSignature);
      expect(result).toEqual({
        status: 'success',
        data: null,
        message: 'Webhook processado com sucesso',
      });
    });

    it('should reject invalid webhook', async () => {
      const mockTimestamp = '1234567890';
      const mockBody = JSON.stringify({ event: 'activity.created' });
      const mockSignature = 'invalid-signature';

      mockCorosService.validateWebhook.mockResolvedValue(false);

      await expect(controller.webhook(mockTimestamp, mockSignature, mockBody))
        .rejects
        .toThrow('Assinatura do webhook inválida');
    });
  });
}); 