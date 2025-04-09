import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const result = await service.validateUser('aluno@exemplo.com', 'senha123');
      expect(result).toEqual({
        id: expect.any(Number),
        email: 'aluno@exemplo.com',
        name: expect.any(String),
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      await expect(
        service.validateUser('invalid@email.com', 'wrongpass'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access token when login is successful', async () => {
      const user = {
        id: 1,
        email: 'aluno@exemplo.com',
        name: 'Aluno Teste',
      };

      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      const result = await service.login(user);

      expect(result).toEqual({
        access_token: 'mock.jwt.token',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
    });
  });
}); 