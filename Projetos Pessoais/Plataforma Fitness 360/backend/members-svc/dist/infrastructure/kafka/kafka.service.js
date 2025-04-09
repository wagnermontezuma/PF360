"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let KafkaService = class KafkaService {
    async onModuleInit() {
        await this.client.connect();
    }
    async emit(topic, message) {
        try {
            await this.client.emit(topic, message).toPromise();
        }
        catch (error) {
            console.error(`Erro ao emitir evento Kafka: ${error.message}`);
            throw error;
        }
    }
};
exports.KafkaService = KafkaService;
__decorate([
    (0, microservices_1.Client)({
        transport: microservices_1.Transport.KAFKA,
        options: {
            client: {
                clientId: 'members-service',
                brokers: ['kafka:9092'],
            },
            consumer: {
                groupId: 'members-consumer-group',
            },
        },
    }),
    __metadata("design:type", microservices_1.ClientKafka)
], KafkaService.prototype, "client", void 0);
exports.KafkaService = KafkaService = __decorate([
    (0, common_1.Injectable)()
], KafkaService);
//# sourceMappingURL=kafka.service.js.map