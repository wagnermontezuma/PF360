import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './feedback.entity';
export declare class FeedbackService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createFeedbackDto: CreateFeedbackDto): Promise<{
        id: string;
        userId: string;
        nota: number;
        comentario: string;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        userId: string;
        nota: number;
        comentario: string;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        userId: string;
        nota: number;
        comentario: string;
        createdAt: Date;
    }>;
    findByUserId(userId: string): Promise<{
        id: string;
        userId: string;
        nota: number;
        comentario: string;
        createdAt: Date;
    }[]>;
    update(id: string, updateFeedbackDto: Partial<CreateFeedbackDto>): Promise<{
        id: string;
        userId: string;
        nota: number;
        comentario: string;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        userId: string;
        nota: number;
        comentario: string;
        createdAt: Date;
    }>;
    getAverageScore(): Promise<number>;
}
