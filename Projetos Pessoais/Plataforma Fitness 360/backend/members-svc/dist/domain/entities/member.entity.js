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
const graphql_1 = require("@nestjs/graphql");
const contract_entity_1 = require("./contract.entity");
let Member = class Member {
};
exports.Member = Member;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Member.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Member.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Member.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Member.prototype, "cpf", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Member.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Member.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Member.prototype, "tenantId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => contract_entity_1.Contract, contract => contract.member),
    (0, graphql_1.Field)(() => [contract_entity_1.Contract]),
    __metadata("design:type", Array)
], Member.prototype, "contracts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Member.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Member.prototype, "updatedAt", void 0);
exports.Member = Member = __decorate([
    (0, typeorm_1.Entity)(),
    (0, graphql_1.ObjectType)()
], Member);
//# sourceMappingURL=member.entity.js.map