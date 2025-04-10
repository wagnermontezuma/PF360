import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
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
    it('should return access token and user when login is successful', async () => {
      // Preparar
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'USER',
      };

      const mockAccessToken = 'mock-access-token';
      
      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      mockJwtService.signAsync.mockResolvedValue(mockAccessToken);
      
      // Executar
      const result = await service.login('test@example.com', 'password123');
      
      // Verificar
      expect(service.validateUser).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        {
          sub: mockUser.id,
          email: mockUser.email,
          role: mockUser.role,
        },
        {
          secret: 'test-secret',
          expiresIn: '1d',
        }
      );
      
      expect(result).toEqual({
        access_token: mockAccessToken,
        user: mockUser,
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
    it('should register a new user successfully', async () => {
      // Preparar
      const email = 'new@example.com';
      const password = 'password123';
      const name = 'New User';
      const hashedPassword = 'hashed_password';
      
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      
      const mockCreatedUser = {
        id: 1,
        email,
        password: hashedPassword,
        name,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);
      
      // Executar
      const result = await service.register(email, password, name);
      
      // Verificar
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'USER',
        },
      });
      
      expect(result).toEqual({
        id: mockCreatedUser.id,
        email: mockCreatedUser.email,
        name: mockCreatedUser.name,
        role: mockCreatedUser.role,
        createdAt: mockCreatedUser.createdAt,
        updatedAt: mockCreatedUser.updatedAt,
      });
      
      expect(result).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException if email already exists', async () => {
      // Preparar
      const email = 'existing@example.com';
      const password = 'password123';
      const name = 'Existing User';
      
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email,
        password: 'some_hash',
        name,
        role: 'USER',
      });
      
      // Executar e verificar
      await expect(service.register(email, password, name))
        .rejects.toThrow(UnauthorizedException);
      
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
      
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });
}); 