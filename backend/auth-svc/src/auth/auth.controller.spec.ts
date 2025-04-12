import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    refreshToken: jest.fn(),
    logout: jest.fn(),
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

  describe('login', () => {
    it('should return login response', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const expectedResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'aluno',
        },
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);
      expect(result).toEqual(expectedResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('register', () => {
    it('should return register response', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
        role: 'aluno',
      };

      const expectedResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'aluno',
        },
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      jest.spyOn(authService, 'register').mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);
      expect(result).toEqual(expectedResponse);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('forgotPassword', () => {
    it('should return success message', async () => {
      const forgotPasswordDto = {
        email: 'test@example.com',
      };

      const expectedResponse = {
        message: 'Email de recuperação enviado com sucesso',
      };

      jest.spyOn(authService, 'forgotPassword').mockResolvedValue(expectedResponse);

      const result = await controller.forgotPassword(forgotPasswordDto);
      expect(result).toEqual(expectedResponse);
      expect(authService.forgotPassword).toHaveBeenCalledWith(forgotPasswordDto);
    });
  });

  describe('resetPassword', () => {
    it('should return success message', async () => {
      const resetPasswordDto = {
        token: 'reset-token',
        password: 'newpassword',
      };

      const expectedResponse = {
        message: 'Senha alterada com sucesso',
      };

      jest.spyOn(authService, 'resetPassword').mockResolvedValue(expectedResponse);

      const result = await controller.resetPassword(resetPasswordDto);
      expect(result).toEqual(expectedResponse);
      expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
    });
  });

  describe('refreshToken', () => {
    it('should return new access token', async () => {
      const refreshTokenDto = {
        refreshToken: 'refresh-token',
      };

      const expectedResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      jest.spyOn(authService, 'refreshToken').mockResolvedValue(expectedResponse);

      const result = await controller.refreshToken(refreshTokenDto);
      expect(result).toEqual(expectedResponse);
      expect(authService.refreshToken).toHaveBeenCalledWith(refreshTokenDto);
    });
  });

  describe('logout', () => {
    it('should return success message', async () => {
      const userId = '1';
      const expectedResponse = {
        message: 'Logout realizado com sucesso',
      };

      jest.spyOn(authService, 'logout').mockResolvedValue(expectedResponse);

      const result = await controller.logout(userId);
      expect(result).toEqual(expectedResponse);
      expect(authService.logout).toHaveBeenCalledWith(userId);
    });
  });
}); 