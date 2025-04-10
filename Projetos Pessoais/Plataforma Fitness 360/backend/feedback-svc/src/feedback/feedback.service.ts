import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { KafkaService, KafkaTopics } from '../common/kafka';

@Injectable()
export class FeedbackService {
  constructor(
    private prisma: PrismaService,
    private kafkaService: KafkaService,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto, userId: string) {
    const feedback = await this.prisma.feedback.create({
      data: {
        nota: createFeedbackDto.nota,
        comentario: createFeedbackDto.comentario,
        userId,
      },
    });

    // Emitir evento para o Kafka quando um feedback for criado
    await this.kafkaService.emit({
      topic: KafkaTopics.FEEDBACK_CREATED,
      value: {
        id: feedback.id,
        userId: feedback.userId,
        nota: feedback.nota,
        comentario: feedback.comentario,
        createdAt: feedback.createdAt,
      },
    });

    return feedback;
  }

  findAll() {
    return this.prisma.feedback.findMany();
  }

  async findOne(id: string) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return feedback;
  }

  async findByUserId(userId: string) {
    return this.prisma.feedback.findMany({
      where: { userId },
    });
  }

  async update(id: string, updateFeedbackDto: UpdateFeedbackDto) {
    const feedback = await this.prisma.feedback.update({
      where: { id },
      data: updateFeedbackDto,
    });

    return feedback;
  }

  async remove(id: string) {
    await this.prisma.feedback.delete({
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