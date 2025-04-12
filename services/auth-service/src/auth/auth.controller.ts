import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerifyTwoFactorDto, RefreshTokenDto, AuthResponse } from '../dtos/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<AuthResponse> {
    // Adiciona informações do dispositivo
    loginDto.deviceId = req.headers['user-agent'];
    return this.authService.login(loginDto);
  }

  @Post('verify-2fa')
  @HttpCode(HttpStatus.OK)
  async verifyTwoFactor(
    @Body() verifyDto: VerifyTwoFactorDto,
  ): Promise<AuthResponse> {
    return this.authService.verifyTwoFactor(verifyDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponse> {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    // Implementar logout (revogar tokens)
    return { message: 'Logout realizado com sucesso' };
  }
} 