import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Workout Service - Fitness 360')
    .setDescription(`
      API de Gerenciamento de Treinos da Plataforma Fitness 360.
      
      ## Funcionalidades
      
      - Criação e gerenciamento de planos de treino
      - Programação de séries e exercícios
      - Acompanhamento de progresso
      - Histórico de treinos realizados
      - Recomendações personalizadas
      - Métricas de desempenho
      - Integração com wearables
      
      ## Segurança
      
      Esta API implementa as melhores práticas de segurança:
      - Autenticação via JWT Bearer Token
      - Autorização baseada em função (RBAC)
      - Rate limiting para prevenção de ataques DoS
      - Validação rigorosa de entrada
      
      ## Rate Limiting
      
      A API possui limite de 30 requisições por minuto por usuário autenticado.
    `)
    .setVersion('1.0')
    .setContact('Equipe Fitness 360', 'https://fitness360.com.br', 'treinos@fitness360.com.br')
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
    .addTag('workouts', 'Planos e programas de treino')
    .addTag('exercises', 'Catálogo de exercícios')
    .addTag('progress', 'Acompanhamento de progresso')
    .addTag('metrics', 'Métricas e analytics')
    .addTag('wearables', 'Integração com dispositivos')
    .addServer('http://localhost:3002', 'Servidor local')
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
  
  await app.listen(process.env.PORT || 3002);
  console.log(`Serviço de treinos rodando na porta ${process.env.PORT || 3002}`);
}

bootstrap(); 