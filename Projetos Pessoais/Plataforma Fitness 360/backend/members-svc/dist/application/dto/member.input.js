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
exports.UpdateMemberInput = exports.CreateMemberInput = void 0;
const graphql_1 = require("@nestjs/graphql");
let CreateMemberInput = class CreateMemberInput {
};
exports.CreateMemberInput = CreateMemberInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateMemberInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateMemberInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateMemberInput.prototype, "cpf", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateMemberInput.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateMemberInput.prototype, "address", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateMemberInput.prototype, "tenantId", void 0);
exports.CreateMemberInput = CreateMemberInput = __decorate([
    (0, graphql_1.InputType)()
], CreateMemberInput);
let UpdateMemberInput = class UpdateMemberInput {
};
exports.UpdateMemberInput = UpdateMemberInput;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateMemberInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateMemberInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateMemberInput.prototype, "phone", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UpdateMemberInput.prototype, "address", void 0);
exports.UpdateMemberInput = UpdateMemberInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateMemberInput);
//# sourceMappingURL=member.input.js.map