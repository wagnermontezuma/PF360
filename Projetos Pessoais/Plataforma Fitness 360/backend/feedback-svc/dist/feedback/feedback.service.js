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
exports.FeedbackService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FeedbackService = class FeedbackService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createFeedbackDto) {
        return this.prisma.feedback.create({
            data: createFeedbackDto,
        });
    }
    async findAll() {
        return this.prisma.feedback.findMany();
    }
    async findOne(id) {
        return this.prisma.feedback.findUnique({
            where: { id },
        });
    }
    async findByUserId(userId) {
        return this.prisma.feedback.findMany({
            where: { userId },
        });
    }
    async update(id, updateFeedbackDto) {
        return this.prisma.feedback.update({
            where: { id },
            data: updateFeedbackDto,
        });
    }
    async remove(id) {
        return this.prisma.feedback.delete({
            where: { id },
        });
    }
    async getAverageScore() {
        const feedbacks = await this.prisma.feedback.findMany({
            select: { nota: true },
        });
        if (feedbacks.length === 0) {
            return 0;
        }
        const sum = feedbacks.reduce((acc, curr) => acc + curr.nota, 0);
        return sum / feedbacks.length;
    }
};
exports.FeedbackService = FeedbackService;
exports.FeedbackService = FeedbackService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeedbackService);
//# sourceMappingURL=feedback.service.js.map