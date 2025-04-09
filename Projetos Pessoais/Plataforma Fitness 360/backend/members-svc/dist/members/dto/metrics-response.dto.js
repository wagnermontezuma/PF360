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
exports.MetricsResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class MetricsResponseDto {
}
exports.MetricsResponseDto = MetricsResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Número total de membros' }),
    __metadata("design:type", Number)
], MetricsResponseDto.prototype, "totalMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Número de membros ativos' }),
    __metadata("design:type", Number)
], MetricsResponseDto.prototype, "activeMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Número de membros premium' }),
    __metadata("design:type", Number)
], MetricsResponseDto.prototype, "premiumMembers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Taxa de ativação em porcentagem' }),
    __metadata("design:type", Number)
], MetricsResponseDto.prototype, "activationRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Taxa de membros premium em porcentagem' }),
    __metadata("design:type", Number)
], MetricsResponseDto.prototype, "premiumRate", void 0);
//# sourceMappingURL=metrics-response.dto.js.map