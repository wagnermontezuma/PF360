import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto, Feedback } from './feedback.entity';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: PrismaService,
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

    service = module.get<FeedbackService>(FeedbackService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a feedback', async () => {
      const createFeedbackDto: CreateFeedbackDto = {
        userId: '1',
        nota: 5,
        comentario: 'Ótimo serviço!',
      };

      const expectedFeedback: Feedback = {
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
      const expectedFeedbacks: Feedback[] = [
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
      const expectedFeedbacks: Feedback[] = [
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
      const feedbacks: Feedback[] = [
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