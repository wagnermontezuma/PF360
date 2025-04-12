import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
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
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    const signUpDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    beforeEach(() => {
      mockJwtService.signAsync.mockResolvedValueOnce('access_token');
      mockJwtService.signAsync.mockResolvedValueOnce('refresh_token');
      mockConfigService.get.mockReturnValue('secret');
    });

    it('should create a new user and return tokens', async () => {
      const hashedPassword = 'hashed_password';
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce(hashedPassword);

      mockPrismaService.user.create.mockResolvedValueOnce({
        id: '1',
        email: signUpDto.email,
        name: signUpDto.name,
      });

      const result = await service.signUp(signUpDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: signUpDto.email,
          password: hashedPassword,
          name: signUpDto.name,
        },
      });
      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
    });
  });

  describe('signIn', () => {
    const signInDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const user = {
      id: '1',
      email: 'test@example.com',
      password: 'hashed_password',
    };

    beforeEach(() => {
      mockJwtService.signAsync.mockResolvedValueOnce('access_token');
      mockJwtService.signAsync.mockResolvedValueOnce('refresh_token');
      mockConfigService.get.mockReturnValue('secret');
    });

    it('should return tokens for valid credentials', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

      const result = await service.signIn(signInDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: signInDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInDto.password,
        user.password,
      );
      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        'Credenciais inválidas',
      );
    });
  });

  describe('refreshToken', () => {
    const refreshTokenValue = 'valid_refresh_token';
    const user = {
      id: '1',
      email: 'test@example.com',
    };

    beforeEach(() => {
      mockJwtService.signAsync.mockResolvedValueOnce('new_access_token');
      mockJwtService.signAsync.mockResolvedValueOnce('new_refresh_token');
      mockConfigService.get.mockReturnValue('secret');
    });

    it('should return new tokens for valid refresh token', async () => {
      mockPrismaService.refreshToken.findUnique.mockResolvedValueOnce({
        id: '1',
        token: refreshTokenValue,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        user,
      });

      const result = await service.refreshToken(refreshTokenValue);

      expect(mockPrismaService.refreshToken.findUnique).toHaveBeenCalledWith({
        where: { token: refreshTokenValue },
        include: { user: true },
      });
      expect(result).toEqual({
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      });
    });

    it('should throw UnauthorizedException for expired refresh token', async () => {
      mockPrismaService.refreshToken.findUnique.mockResolvedValueOnce({
        id: '1',
        token: refreshTokenValue,
        userId: user.id,
        expiresAt: new Date(Date.now() - 1000),
        user,
      });

      await expect(service.refreshToken(refreshTokenValue)).rejects.toThrow(
        'Token inválido ou expirado',
      );
    });
  });
}); 