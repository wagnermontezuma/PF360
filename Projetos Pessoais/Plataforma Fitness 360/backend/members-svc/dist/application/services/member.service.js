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
exports.MemberService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const member_entity_1 = require("../../domain/entities/member.entity");
const contract_entity_1 = require("../../domain/entities/contract.entity");
const kafka_service_1 = require("../../infrastructure/kafka/kafka.service");
let MemberService = class MemberService {
    constructor(memberRepository, contractRepository, kafkaService) {
        this.memberRepository = memberRepository;
        this.contractRepository = contractRepository;
        this.kafkaService = kafkaService;
    }
    async createMember(input) {
        const member = this.memberRepository.create({
            name: input.name,
            email: input.email,
            cpf: input.cpf,
            phone: input.phone,
            address: input.address,
            tenantId: input.tenantId,
        });
        const savedMember = await this.memberRepository.save(member);
        await this.kafkaService.emit('member.created', {
            id: savedMember.id,
            email: savedMember.email,
        });
        return savedMember;
    }
    async updateMember(id, input) {
        const member = await this.memberRepository.findOne({ where: { id } });
        if (!member) {
            throw new Error('Membro não encontrado');
        }
        if (input.name)
            member.name = input.name;
        if (input.email)
            member.email = input.email;
        if (input.phone)
            member.phone = input.phone;
        if (input.address)
            member.address = input.address;
        return await this.memberRepository.save(member);
    }
    async deleteMember(id) {
        const result = await this.memberRepository.delete(id);
        return result.affected > 0;
    }
    async getMember(id) {
        const member = await this.memberRepository.findOne({ where: { id } });
        if (!member) {
            throw new Error('Membro não encontrado');
        }
        return member;
    }
    async getAllMembers() {
        return await this.memberRepository.find();
    }
    async getMemberContracts(memberId) {
        return await this.contractRepository.find({
            where: { member: { id: memberId } },
            relations: ['member'],
        });
    }
};
exports.MemberService = MemberService;
exports.MemberService = MemberService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(member_entity_1.Member)),
    __param(1, (0, typeorm_1.InjectRepository)(contract_entity_1.Contract)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        kafka_service_1.KafkaService])
], MemberService);
//# sourceMappingURL=member.service.js.map