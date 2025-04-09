"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const feedback_service_1 = require("./feedback.service");
const prisma_service_1 = require("../prisma/prisma.service");
describe('FeedbackService', () => {
    let service;
    let prisma;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                feedback_service_1.FeedbackService,
                {
                    provide: prisma_service_1.PrismaService,
                    useValue: {
                        feedback: {
                            create: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();
        service = module.get(feedback_service_1.FeedbackService);
        prisma = module.get(prisma_service_1.PrismaService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('create', () => {
        it('should create a feedback', async () => {
            const createFeedbackDto = {
                userId: '1',
                nota: 5,
                comentario: 'Ótimo serviço!',
            };
            const expectedFeedback = {
                id: '1',
                ...createFeedbackDto,
                createdAt: new Date(),
            };
            jest.spyOn(prisma.feedback, 'create').mockResolvedValue(expectedFeedback);
            const result = await service.create(createFeedbackDto);
            expect(result).toEqual(expectedFeedback);
        });
    });
    describe('findAll', () => {
        it('should return an array of feedbacks', async () => {
            const expectedFeedbacks = [
                {
                    id: '1',
                    userId: '1',
                    nota: 5,
                    comentario: 'Ótimo serviço!',
                    createdAt: new Date(),
                },
            ];
            jest.spyOn(prisma.feedback, 'findMany').mockResolvedValue(expectedFeedbacks);
            const result = await service.findAll();
            expect(result).toEqual(expectedFeedbacks);
        });
    });
    describe('findByUserId', () => {
        it('should return feedbacks for a specific user', async () => {
            const userId = '1';
            const expectedFeedbacks = [
                {
                    id: '1',
                    userId,
                    nota: 5,
                    comentario: 'Ótimo serviço!',
                    createdAt: new Date(),
                },
            ];
            jest.spyOn(prisma.feedback, 'findMany').mockResolvedValue(expectedFeedbacks);
            const result = await service.findByUserId(userId);
            expect(result).toEqual(expectedFeedbacks);
        });
    });
    describe('getAverageScore', () => {
        it('should return the average score of all feedbacks', async () => {
            const feedbacks = [
                {
                    id: '1',
                    userId: '1',
                    nota: 4,
                    comentario: 'Bom',
                    createdAt: new Date(),
                },
                {
                    id: '2',
                    userId: '2',
                    nota: 5,
                    comentario: 'Ótimo',
                    createdAt: new Date(),
                },
                {
                    id: '3',
                    userId: '3',
                    nota: 3,
                    comentario: 'Regular',
                    createdAt: new Date(),
                },
            ];
            jest.spyOn(prisma.feedback, 'findMany').mockResolvedValue(feedbacks);
            const result = await service.getAverageScore();
            expect(result).toBe(4);
        });
        it('should return 0 when there are no feedbacks', async () => {
            jest.spyOn(prisma.feedback, 'findMany').mockResolvedValue([]);
            const result = await service.getAverageScore();
            expect(result).toBe(0);
        });
    });
});
//# sourceMappingURL=feedback.service.spec.js.map