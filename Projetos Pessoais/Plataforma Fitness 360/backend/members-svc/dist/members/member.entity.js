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
exports.Member = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
let Member = class Member {
};
exports.Member = Member;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], Member.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Member.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], Member.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Member.prototype, "cpf", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], Member.prototype, "dataNascimento", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], Member.prototype, "planoId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Member.prototype, "plan", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], Member.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Member.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], Member.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Member.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Member.prototype, "lastLogin", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Member.prototype, "updatedAt", void 0);
exports.Member = Member = __decorate([
    (0, typeorm_1.Entity)('members')
], Member);
//# sourceMappingURL=member.entity.js.map