import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API Gateway - Fitness 360')
    .setDescription(`
      API Gateway da Plataforma Fitness 360 - Portal central para todos os microsserviços.
      
      ## Microsserviços Disponíveis
      
      ### Autenticação (Auth Service)
      - Registro de usuários (alunos e instrutores)
      - Login e autenticação
      - Recuperação de senha
      - Controle de acesso baseado em funções
      
      ### Treinos (Workout Service)
      - Criação e gerenciamento de planos de treino
      - Acompanhamento de progresso
      - Histórico de treinos
      - Métricas de desempenho
      
      ### Nutrição (Nutrition Service)
      - Planejamento de dietas personalizadas
      - Monitoramento de macronutrientes
      - Registro de refeições
      - Objetivos nutricionais
      
      ### Notificações (Notifications Service)
      - Envio de emails
      - Notificações push
      - Notificações em tempo real
      - Preferências de notificação
      
      ## Segurança
      
      Este gateway implementa:
      - Autenticação centralizada
      - Rate limiting global
      - Auditoria de requisições
      - Validação e sanitização de dados
      - CORS configurado
      
      ## Documentação Detalhada
      
      Para documentação detalhada de cada serviço, acesse:
      - Auth Service: http://localhost:3001/api
      - Workout Service: http://localhost:3002/api
      - Nutrition Service: http://localhost:3003/api
      - Notifications Service: http://localhost:3004/api
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
    .addTag('auth', 'Redirecionamentos para serviço de autenticação')
    .addTag('workouts', 'Redirecionamentos para serviço de treinos')
    .addTag('nutrition', 'Redirecionamentos para serviço de nutrição')
    .addTag('notifications', 'Redirecionamentos para serviço de notificações')
    .addTag('status', 'Verificação de status dos microsserviços')
    .addServer('http://localhost:3000', 'API Gateway Local')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3006',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });
  
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`API Gateway rodando na porta ${port}`);
}

bootstrap(); 