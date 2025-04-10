import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3006',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Authentication Service - Fitness 360')
    .setDescription(`
      API de Autenticação da Plataforma Fitness 360.
      
      ## Funcionalidades
      
      - Registro de usuários (alunos e instrutores)
      - Login e autenticação
      - Recuperação de senha
      - Verificação de conta
      - Gerenciamento de perfil
      - Autenticação com provedores externos (Google, Facebook)
      - Controle de acesso baseado em funções (RBAC)
      
      ## Segurança
      
      Esta API implementa as melhores práticas de segurança:
      - Senhas com hash usando bcrypt
      - Proteção contra ataques de força bruta
      - Rate limiting para prevenção de ataques DoS
      - Tokens JWT com expiração
      - Renovação segura de tokens
      
      ## Rate Limiting
      
      A API possui limite de 5 tentativas de login por minuto por IP.
    `)
    .setVersion('1.0')
    .setContact('Equipe Fitness 360', 'https://fitness360.com.br', 'seguranca@fitness360.com.br')
    .setLicense('MIT License', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header'
      },
      'access-token',
    )
    .addTag('auth', 'Autenticação e autorização')
    .addTag('users', 'Gerenciamento de usuários')
    .addTag('profile', 'Gerenciamento de perfil')
    .addTag('roles', 'Controle de acesso e permissões')
    .addServer('http://localhost:3001', 'Servidor local')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Pipes globais
  app.useGlobalPipes(new ValidationPipe());
  
  // Cookie parser
  app.use(cookieParser());

  // Aplicar ThrottlerGuard globalmente via provider no AppModule
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Serviço de autenticação rodando na porta ${port}`);
}

bootstrap();
