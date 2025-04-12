import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    refreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    const signUpDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    it('should call authService.signUp with correct params', async () => {
      const expectedResult = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };
      mockAuthService.signUp.mockResolvedValueOnce(expectedResult);

      const result = await controller.signUp(signUpDto);

      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('signIn', () => {
    const signInDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should call authService.signIn with correct params', async () => {
      const expectedResult = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };
      mockAuthService.signIn.mockResolvedValueOnce(expectedResult);

      const result = await controller.signIn(signInDto);

      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('refreshToken', () => {
    const refreshToken = 'valid_refresh_token';

    it('should call authService.refreshToken with correct params', async () => {
      const expectedResult = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      };
      mockAuthService.refreshToken.mockResolvedValueOnce(expectedResult);

      const result = await controller.refreshToken(refreshToken);

      expect(authService.refreshToken).toHaveBeenCalledWith(refreshToken);
      expect(result).toEqual(expectedResult);
    });
  });
}); 