import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Billing Service - Fitness 360')
    .setDescription(`
      API de Faturamento da Plataforma Fitness 360.
      
      ## Funcionalidades
      
      - Métricas de faturamento para dashboard
      - Informações de planos e pagamentos
      - Histórico de faturas e cobranças
      - Integração com sistema financeiro
      
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
    .addTag('billing', 'Endpoints de faturamento e cobrança')
    .addTag('dashboard', 'Métricas para dashboard financeiro')
    .addTag('invoices', 'Gerenciamento de faturas')
    .addServer('http://localhost:3004', 'Servidor local')
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
  
  await app.listen(process.env.PORT || 3004);
}

bootstrap(); 