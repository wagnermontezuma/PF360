import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { NotificationTemplateService } from './notification-template.service';
import { NotificationType } from '../enums/notification.enum';

describe('NotificationTemplateService', () => {
  let service: NotificationTemplateService;
  let prisma: PrismaClient;

  const mockTemplate = {
    id: 'template-123',
    type: NotificationType.TRAINING_REMINDER,
    title: 'Olá {{nome}}, seu treino está agendado!',
    content: 'Seu treino de {{tipo_treino}} está marcado para {{horario}}.',
    language: 'pt-BR',
    variables: ['nome', 'tipo_treino', 'horario'],
  };

  const mockPrisma = {
    $queryRaw: jest.fn(),
    $executeRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationTemplateService,
        {
          provide: PrismaClient,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<NotificationTemplateService>(NotificationTemplateService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTemplate', () => {
    it('deve retornar template por tipo e idioma', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([mockTemplate]);

      const result = await service.getTemplate(NotificationType.TRAINING_REMINDER);
      
      expect(result).toEqual([mockTemplate]);
      expect(mockPrisma.$queryRaw).toHaveBeenCalled();
    });

    it('deve retornar array vazio quando template não existe', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([]);

      const result = await service.getTemplate(NotificationType.TRAINING_REMINDER);
      
      expect(result).toEqual([]);
    });
  });

  describe('createTemplate', () => {
    it('deve criar novo template', async () => {
      const templateData = {
        type: NotificationType.TRAINING_REMINDER,
        title: 'Novo treino para {{nome}}',
        content: 'Detalhes do treino: {{detalhes}}',
        variables: ['nome', 'detalhes'],
      };

      await service.createTemplate(templateData);

      expect(mockPrisma.$executeRaw).toHaveBeenCalled();
    });
  });

  describe('renderTemplate', () => {
    it('deve renderizar template substituindo variáveis', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([mockTemplate]);

      const variables = {
        nome: 'João',
        tipo_treino: 'Musculação',
        horario: '14:00',
      };

      const result = await service.renderTemplate(
        NotificationType.TRAINING_REMINDER,
        variables,
      );

      expect(result).toEqual({
        title: 'Olá João, seu treino está agendado!',
        content: 'Seu treino de Musculação está marcado para 14:00.',
      });
    });

    it('deve lançar erro quando template não existe', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([]);

      await expect(
        service.renderTemplate(NotificationType.TRAINING_REMINDER, {}),
      ).rejects.toThrow('Template não encontrado');
    });

    it('deve lançar erro quando faltam variáveis', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([mockTemplate]);

      const variables = {
        nome: 'João',
        // faltando tipo_treino e horario
      };

      await expect(
        service.renderTemplate(NotificationType.TRAINING_REMINDER, variables),
      ).rejects.toThrow('Variáveis obrigatórias não fornecidas');
    });
  });

  describe('deleteTemplate', () => {
    it('deve deletar template', async () => {
      await service.deleteTemplate(NotificationType.TRAINING_REMINDER);

      expect(mockPrisma.$executeRaw).toHaveBeenCalled();
    });
  });

  describe('listTemplates', () => {
    it('deve listar templates por idioma', async () => {
      const templates = [mockTemplate];
      mockPrisma.$queryRaw.mockResolvedValue(templates);

      const result = await service.listTemplates();

      expect(result).toEqual(templates);
      expect(mockPrisma.$queryRaw).toHaveBeenCalled();
    });
  });
}); 