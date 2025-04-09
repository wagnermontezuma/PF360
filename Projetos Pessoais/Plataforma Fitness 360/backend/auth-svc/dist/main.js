"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:3002',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Auth Service API')
        .setDescription('API de autenticação do Fitness 360')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use(cookieParser());
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`Serviço de autenticação rodando na porta ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map