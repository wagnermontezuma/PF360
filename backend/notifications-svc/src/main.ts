import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Notifications Service - Fitness 360')
    .setDescription(`
      API de Notificações da Plataforma Fitness 360.
      
      ## Funcionalidades
      
      - Envio de notificações por email
      - Envio de notificações push
      - Notificações em tempo real via WebSockets
      - Histórico de notificações enviadas
      - Preferências de notificação do usuário
      
      ## Autenticação
      
      Esta API utiliza autenticação via Bearer Token JWT obtido pelo serviço de autenticação. 
      Para todos os endpoints, inclua o token no header Authorization no formato: \`Bearer {seu_token}\`.
      
      ## Rate Limiting
      
      A API possui limite de 10 requisições por minuto por IP.
    `)
    .setVersion('1.0')
    .setContact('Equipe Fitness 360', 'https://fitness360.com.br', 'api@fitness360.com.br')
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
    .addTag('notifications', 'Gerenciamento de notificações')
    .addTag('preferences', 'Preferências de notificação do usuário')
    .addTag('templates', 'Gerenciamento de templates de notificação')
    .addServer('http://localhost:3003', 'Servidor local')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3006',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(process.env.PORT || 3003);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap(); 