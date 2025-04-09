import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Feedback Service API')
    .setDescription('API de Feedback da plataforma Fitness 360')
    .setVersion('1.0')
    .addTag('feedback')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  // Configuração do CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3006',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  });
  
  // Filtros globais
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Pipes globais
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  
  app.useGlobalInterceptors(new TransformInterceptor());
  
  const port = process.env.PORT || 3005;
  await app.listen(port);
  
  logger.log(`Serviço de Feedback rodando na porta ${port}`);
}

bootstrap(); 