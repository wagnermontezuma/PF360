import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { MailerService } from '../mailer/mailer.service';

// Mock para o serviço do Prisma
const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

// Mock para o JwtService
const mockJwtService = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
};

// Mock para o ConfigService
const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'JWT_SECRET') return 'test-secret';
    if (key === 'JWT_EXPIRES_IN') return '15m';
    if (key === 'REFRESH_TOKEN_SECRET') return 'refresh-test-secret';
    if (key === 'REFRESH_TOKEN_EXPIRES_IN') return '7d';
    return null;
  }),
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let mailerService: MailerService;

  beforeEach(async () => {
    // Resetar todos os mocks antes de cada teste
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: MailerService,
          useValue: {
            sendPasswordReset: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate a user with correct credentials', async () => {
      // Preparar
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'USER',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      
      // Executar
      const result = await service.validateUser('test@example.com', 'password123');
      
      // Verificar
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          role: true,
        }
      });
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      });
      // Verifica que a senha foi removida do resultado
      expect(result).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      // Preparar
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'USER',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      
      // Executar e verificar
      await expect(service.validateUser('test@example.com', 'wrongpassword'))
        .rejects.toThrow(UnauthorizedException);
      
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          role: true,
        }
      });
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      // Preparar
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      
      // Executar e verificar
      await expect(service.validateUser('nonexistent@example.com', 'password123'))
        .rejects.toThrow(UnauthorizedException);
      
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          role: true,
        }
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException when user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.login({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: 'aluno',
        refreshToken: null,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrongpassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return user and tokens when login is successful', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: 'aluno',
        refreshToken: null,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const tokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
      jest.spyOn(service as any, 'generateTokens').mockResolvedValue(tokens);
      jest.spyOn(service as any, 'updateRefreshToken').mockResolvedValue(undefined);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
        ...tokens,
      });
    });
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', async () => {
      // Preparar
      const userId = 1;
      const email = 'test@example.com';
      const mockAccessToken = 'mock-access-token';
      const mockRefreshToken = 'mock-refresh-token';
      
      mockJwtService.signAsync.mockResolvedValueOnce(mockAccessToken);
      mockJwtService.signAsync.mockResolvedValueOnce(mockRefreshToken);
      
      // Executar
      const result = await service.generateTokens(userId, email);
      
      // Verificar
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
        1,
        { sub: userId, email },
        {
          secret: 'test-secret',
          expiresIn: '15m',
        }
      );
      expect(mockJwtService.signAsync).toHaveBeenNthCalledWith(
        2,
        { sub: userId, email },
        {
          secret: 'refresh-test-secret',
          expiresIn: '7d',
        }
      );
      
      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
    });
  });

  describe('refreshAccessToken', () => {
    it('should generate new access token with a valid refresh token', async () => {
      // Preparar
      const mockRefreshToken = 'valid-refresh-token';
      const mockPayload = { sub: 1, email: 'test@example.com' };
      const mockNewAccessToken = 'new-access-token';
      
      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockJwtService.signAsync.mockResolvedValue(mockNewAccessToken);
      
      // Executar
      const result = await service.refreshAccessToken(mockRefreshToken);
      
      // Verificar
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(
        mockRefreshToken,
        { secret: 'refresh-test-secret' }
      );
      
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { sub: mockPayload.sub, email: mockPayload.email },
        {
          secret: 'test-secret',
          expiresIn: '15m',
        }
      );
      
      expect(result).toEqual({
        accessToken: mockNewAccessToken,
      });
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      // Preparar
      const mockInvalidToken = 'invalid-token';

      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));
      
      // Executar e verificar
      await expect(service.refreshAccessToken(mockInvalidToken))
        .rejects.toThrow(UnauthorizedException);
      
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(
        mockInvalidToken,
        { secret: 'refresh-test-secret' }
      );
    });
  });

  describe('validateRefreshToken', () => {
    it('should validate a refresh token and return payload', async () => {
      // Preparar
      const mockToken = 'valid-refresh-token';
      const mockPayload = { sub: 1, email: 'test@example.com' };
      
      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      
      // Executar
      const result = await service.validateRefreshToken(mockToken);
      
      // Verificar
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(
        mockToken,
        { secret: 'refresh-test-secret' }
      );
      expect(result).toEqual(mockPayload);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      // Preparar
      const mockToken = 'invalid-token';
      
      mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));
      
      // Executar e verificar
      await expect(service.validateRefreshToken(mockToken))
        .rejects.toThrow(UnauthorizedException);
      
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(
        mockToken,
        { secret: 'refresh-test-secret' }
      );
    });
  });

  describe('register', () => {
    it('should throw BadRequestException when email already exists', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: 'aluno',
        refreshToken: null,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password',
          name: 'Test User',
          role: 'aluno',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create user and return tokens when registration is successful', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: 'aluno',
        refreshToken: null,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const tokens = {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashedPassword');
      jest.spyOn(service as any, 'generateTokens').mockResolvedValue(tokens);
      jest.spyOn(service as any, 'updateRefreshToken').mockResolvedValue(undefined);

      const result = await service.register({
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
        role: 'aluno',
      });

      expect(result).toEqual({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
        ...tokens,
      });
    });
  });

  describe('forgotPassword', () => {
    it('should throw BadRequestException when email not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.forgotPassword({ email: 'test@example.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should send reset password email when email exists', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: 'aluno',
        refreshToken: null,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(mockUser);
      jest.spyOn(mailerService, 'sendPasswordReset').mockResolvedValue(undefined);

      const result = await service.forgotPassword({ email: 'test@example.com' });

      expect(result).toEqual({
        message: 'Email de recuperação enviado com sucesso',
      });
      expect(mailerService.sendPasswordReset).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should throw BadRequestException when token is invalid', async () => {
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

      await expect(
        service.resetPassword({ token: 'invalid-token', password: 'newpassword' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update password when token is valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        role: 'aluno',
        refreshToken: null,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'newHashedPassword');

      const result = await service.resetPassword({
        token: 'valid-token',
        password: 'newpassword',
      });

      expect(result).toEqual({
        message: 'Senha alterada com sucesso',
      });
    });
  });
}); 