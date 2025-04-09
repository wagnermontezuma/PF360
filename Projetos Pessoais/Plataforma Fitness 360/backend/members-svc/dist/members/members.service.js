"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
let MembersService = class MembersService {
    constructor() {
        this.members = [
            {
                id: 1,
                name: 'João Silva',
                email: 'joao@exemplo.com',
                plan: 'Premium',
                startDate: '2024-01-15',
                status: 'Ativo'
            },
            {
                id: 2,
                name: 'Maria Santos',
                email: 'maria@exemplo.com',
                plan: 'Basic',
                startDate: '2024-02-01',
                status: 'Ativo'
            },
            {
                id: 3,
                name: 'Pedro Oliveira',
                email: 'pedro@exemplo.com',
                plan: 'Premium',
                startDate: '2024-01-10',
                status: 'Inativo'
            }
        ];
    }
    async findAll() {
        return this.members;
    }
    async getMetrics() {
        const totalMembers = this.members.length;
        const activeMembers = this.members.filter(m => m.status === 'Ativo').length;
        const premiumMembers = this.members.filter(m => m.plan === 'Premium').length;
        return {
            totalMembers,
            activeMembers,
            premiumMembers,
            activationRate: (activeMembers / totalMembers) * 100,
            premiumRate: (premiumMembers / totalMembers) * 100
        };
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = __decorate([
    (0, common_1.Injectable)()
], MembersService);
//# sourceMappingURL=members.service.js.map