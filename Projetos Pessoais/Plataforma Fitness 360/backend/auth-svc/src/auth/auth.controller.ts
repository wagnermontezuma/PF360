import { Controller, Post, Body, Get, UseGuards, Request, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiResponse({ 
    status: 200, 
    description: 'Retorna o token de acesso e dados do usuário'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciais inválidas'
  })
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    const result = await this.authService.login(email, password);
    
    // Gera tokens de acesso e refresh
    const tokens = await this.authService.generateTokens(result.user.id, email);
    
    return {
      ...result,
      refresh_token: tokens.refreshToken
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Renovar token de acesso usando refresh token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Retorna um novo token de acesso'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Refresh token inválido ou expirado'
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refresh_token);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async register(@Body() registerDto: { email: string; password: string; name: string }) {
    return this.authService.register(registerDto.email, registerDto.password, registerDto.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Retorna os dados do perfil do usuário'
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado'
  })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('validate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validar token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Token válido'
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou expirado'
  })
  async validateToken(@Request() req) {
    return { valid: true, userId: req.user.sub };
  }
}
