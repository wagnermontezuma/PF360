import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Billing Service - Fitness 360')
    .setDescription('Serviço de faturamento da plataforma Fitness 360')
    .setVersion('1.0')
    .addTag('billing')
    .addBearerAuth()
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