import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
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
    .setTitle('Auth Service API')
    .setDescription('API de autenticação do Fitness 360')
    .setVersion('1.0')
    .addBearerAuth()
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
