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
exports.MembersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const members_service_1 = require("./members.service");
class MetricsResponseDto {
}
let MembersController = class MembersController {
    constructor(membersService) {
        this.membersService = membersService;
    }
    async findAll() {
        return this.membersService.findAll();
    }
    async getMetrics() {
        return this.membersService.getMetrics();
    }
};
exports.MembersController = MembersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lista todos os membros' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de membros retornada com sucesso',
        type: (Array)
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Retorna métricas dos membros' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Métricas retornadas com sucesso',
        type: MetricsResponseDto
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "getMetrics", null);
exports.MembersController = MembersController = __decorate([
    (0, swagger_1.ApiTags)('members'),
    (0, common_1.Controller)('members'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [members_service_1.MembersService])
], MembersController);
//# sourceMappingURL=members.controller.js.map