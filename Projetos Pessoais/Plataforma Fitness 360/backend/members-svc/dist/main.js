"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Members Service - Fitness 360')
        .setDescription('Serviço de gerenciamento de membros da plataforma Fitness 360')
        .setVersion('1.0')
        .addTag('members')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3002',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(process.env.PORT || 3003);
}
bootstrap();
//# sourceMappingURL=main.js.map