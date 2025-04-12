import { Test, TestingModule } from '@nestjs/testing';
import { NotificationTemplateController } from './notification-template.controller';
import { NotificationTemplateService } from '../services/notification-template.service';
import { NotificationType } from '../enums/notification.enum';
import { CreateTemplateDto } from '../dto/create-template.dto';

describe('NotificationTemplateController', () => {
  let controller: NotificationTemplateController;
  let service: NotificationTemplateService;

  const mockTemplate = {
    type: NotificationType.WORKOUT_REMINDER,
    title: 'Lembrete de Treino',
    content: 'Olá {{name}}, seu treino está agendado para {{time}}',
    language: 'pt-BR',
    variables: ['name', 'time'],
  };

  const mockTemplateService = {
    createTemplate: jest.fn(),
    getTemplate: jest.fn(),
    listTemplates: jest.fn(),
    deleteTemplate: jest.fn(),
    renderTemplate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationTemplateController],
      providers: [
        {
          provide: NotificationTemplateService,
          useValue: mockTemplateService,
        },
      ],
    }).compile();

    controller = module.get<NotificationTemplateController>(NotificationTemplateController);
    service = module.get<NotificationTemplateService>(NotificationTemplateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTemplate', () => {
    it('should create a new template', async () => {
      const createDto: CreateTemplateDto = mockTemplate;
      mockTemplateService.createTemplate.mockResolvedValue(undefined);

      const result = await controller.createTemplate(createDto);

      expect(service.createTemplate).toHaveBeenCalledWith(createDto);
      expect(result).toEqual({
        status: 'success',
        message: 'Template criado/atualizado com sucesso',
      });
    });

    it('should handle errors when creating template', async () => {
      const createDto: CreateTemplateDto = mockTemplate;
      mockTemplateService.createTemplate.mockRejectedValue(new Error('Database error'));

      await expect(controller.createTemplate(createDto)).rejects.toThrow('Database error');
    });
  });

  describe('listTemplates', () => {
    it('should list all templates', async () => {
      const templates = [mockTemplate];
      mockTemplateService.listTemplates.mockResolvedValue(templates);

      const result = await controller.listTemplates();

      expect(service.listTemplates).toHaveBeenCalled();
      expect(result).toEqual({
        status: 'success',
        data: templates,
      });
    });

    it('should list templates by language', async () => {
      const language = 'pt-BR';
      const templates = [mockTemplate];
      mockTemplateService.listTemplates.mockResolvedValue(templates);

      const result = await controller.listTemplates(language);

      expect(service.listTemplates).toHaveBeenCalledWith(language);
      expect(result).toEqual({
        status: 'success',
        data: templates,
      });
    });
  });

  describe('getTemplate', () => {
    it('should get a template by type', async () => {
      mockTemplateService.getTemplate.mockResolvedValue([mockTemplate]);

      const result = await controller.getTemplate(NotificationType.WORKOUT_REMINDER);

      expect(service.getTemplate).toHaveBeenCalledWith(NotificationType.WORKOUT_REMINDER, undefined);
      expect(result).toEqual({
        status: 'success',
        data: mockTemplate,
      });
    });

    it('should return null when template not found', async () => {
      mockTemplateService.getTemplate.mockResolvedValue([]);

      const result = await controller.getTemplate(NotificationType.WORKOUT_REMINDER);

      expect(result).toEqual({
        status: 'success',
        data: null,
      });
    });
  });

  describe('deleteTemplate', () => {
    it('should delete a template', async () => {
      mockTemplateService.deleteTemplate.mockResolvedValue(undefined);

      const result = await controller.deleteTemplate(NotificationType.WORKOUT_REMINDER);

      expect(service.deleteTemplate).toHaveBeenCalledWith(NotificationType.WORKOUT_REMINDER, undefined);
      expect(result).toEqual({
        status: 'success',
        message: 'Template removido com sucesso',
      });
    });
  });

  describe('renderTemplate', () => {
    it('should render a template with variables', async () => {
      const variables = { name: 'João', time: '10:00' };
      const renderedContent = 'Olá João, seu treino está agendado para 10:00';
      mockTemplateService.renderTemplate.mockResolvedValue(renderedContent);

      const result = await controller.renderTemplate(
        NotificationType.WORKOUT_REMINDER,
        variables,
      );

      expect(service.renderTemplate).toHaveBeenCalledWith(
        NotificationType.WORKOUT_REMINDER,
        variables,
        undefined,
      );
      expect(result).toEqual({
        status: 'success',
        data: renderedContent,
      });
    });

    it('should handle missing variables', async () => {
      const variables = { name: 'João' };
      mockTemplateService.renderTemplate.mockRejectedValue(
        new Error('Missing required variable: time'),
      );

      await expect(
        controller.renderTemplate(NotificationType.WORKOUT_REMINDER, variables),
      ).rejects.toThrow('Missing required variable: time');
    });
  });
}); 