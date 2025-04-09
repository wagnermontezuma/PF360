import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    return this.prisma.feedback.create({
      data: createFeedbackDto,
    });
  }

  async findAll() {
    return this.prisma.feedback.findMany();
  }

  async findOne(id: string) {
    return this.prisma.feedback.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.feedback.findMany({
      where: { userId },
    });
  }

  async update(id: string, updateFeedbackDto: Partial<CreateFeedbackDto>) {
    return this.prisma.feedback.update({
      where: { id },
      data: updateFeedbackDto,
    });
  }

  async remove(id: string) {
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
} 