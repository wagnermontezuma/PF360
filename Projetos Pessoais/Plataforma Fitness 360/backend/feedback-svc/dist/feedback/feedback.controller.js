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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const common_1 = require("@nestjs/common");
const feedback_service_1 = require("./feedback.service");
const swagger_1 = require("@nestjs/swagger");
let FeedbackController = class FeedbackController {
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
    }
    create(createFeedbackDto) {
        return this.feedbackService.create(createFeedbackDto);
    }
    findAll() {
        return this.feedbackService.findAll();
    }
    findOne(id) {
        return this.feedbackService.findOne(id);
    }
    findByUserId(userId) {
        return this.feedbackService.findByUserId(userId);
    }
    update(id, updateFeedbackDto) {
        return this.feedbackService.update(id, updateFeedbackDto);
    }
    remove(id) {
        return this.feedbackService.remove(id);
    }
    getAverageScore() {
        return this.feedbackService.getAverageScore();
    }
};
exports.FeedbackController = FeedbackController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Criar novo feedback' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Feedback criado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Não autorizado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todos os feedbacks ou filtrar por usuário' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, description: 'ID do usuário para filtrar feedbacks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de feedbacks retornada com sucesso' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar feedback por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar feedbacks de um usuário' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de feedbacks retornada com sucesso' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar feedback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback atualizado com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover feedback' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feedback removido com sucesso' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Feedback não encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('metrics/average'),
    (0, swagger_1.ApiOperation)({ summary: 'Obter a pontuação média dos feedbacks' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Pontuação média dos feedbacks retornada com sucesso' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "getAverageScore", null);
exports.FeedbackController = FeedbackController = __decorate([
    (0, swagger_1.ApiTags)('feedback'),
    (0, common_1.Controller)('feedback'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [feedback_service_1.FeedbackService])
], FeedbackController);
//# sourceMappingURL=feedback.controller.js.map