import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Nutrition Service - Fitness 360')
    .setDescription(`
      API de Nutrição e Dietas da Plataforma Fitness 360.
      
      ## Funcionalidades
      
      - Planejamento de dietas personalizadas
      - Monitoramento de calorias e macronutrientes
      - Registro de refeições e hidratação
      - Sugestões de cardápios saudáveis
      - Análise de composição nutricional
      - Acompanhamento de objetivos nutricionais
      - Integração com dispositivos de medição
      
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
    .setContact('Equipe Fitness 360', 'https://fitness360.com.br', 'nutricao@fitness360.com.br')
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
    .addTag('diets', 'Planos alimentares e dietas')
    .addTag('meals', 'Registro e planejamento de refeições')
    .addTag('nutrition', 'Informação nutricional e análises')
    .addTag('goals', 'Objetivos nutricionais')
    .addTag('hydration', 'Controle de hidratação')
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
  
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(process.env.PORT || 3003);
  console.log(`Serviço de nutrição rodando na porta ${process.env.PORT || 3003}`);
}

bootstrap(); 