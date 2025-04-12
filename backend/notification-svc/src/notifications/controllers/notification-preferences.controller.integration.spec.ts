import { Test, TestingModule } from '@nestjs/testing';
import { NotificationPreferencesController } from './notification-preferences.controller';
import { NotificationPreferencesService } from '../services/notification-preferences.service';
import { NotificationType, NotificationChannel } from '../enums/notification.enum';
import { UpdateChannelsDto } from '../dto/update-channels.dto';
import { ToggleTypeDto } from '../dto/toggle-type.dto';
import { UpdateManyDto } from '../dto/update-many.dto';
import { CacheService } from '../../cache/cache.service';

describe('NotificationPreferencesController', () => {
  let controller: NotificationPreferencesController;
  let service: NotificationPreferencesService;
  let cacheService: CacheService;

  const mockUserId = 'user-123';
  const mockPreferences = {
    userId: mockUserId,
    preferences: [
      {
        type: NotificationType.WORKOUT_REMINDER,
        channels: [NotificationChannel.PUSH, NotificationChannel.WHATSAPP],
        enabled: true
      },
      {
        type: NotificationType.ASSESSMENT_REMINDER,
        channels: [NotificationChannel.EMAIL],
        enabled: true
      }
    ]
  };

  const mockPreferencesService = {
    getPreferences: jest.fn(),
    updateChannels: jest.fn(),
    toggleType: jest.fn(),
    updateMany: jest.fn()
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
    generateKey: jest.fn((prefix, ...parts) => [prefix, ...parts].join(':'))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationPreferencesController],
      providers: [
        {
          provide: NotificationPreferencesService,
          useValue: mockPreferencesService
        },
        {
          provide: CacheService,
          useValue: mockCacheService
        }
      ]
    }).compile();

    controller = module.get<NotificationPreferencesController>(NotificationPreferencesController);
    service = module.get<NotificationPreferencesService>(NotificationPreferencesService);
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('getPreferences', () => {
    it('deve retornar as preferências do usuário do cache quando disponível', async () => {
      mockCacheService.get.mockResolvedValue(mockPreferences);

      const result = await controller.getPreferences(mockUserId);

      expect(service.getPreferences).not.toHaveBeenCalled();
      expect(result).toEqual({
        status: 'success',
        data: mockPreferences
      });
    });

    it('deve buscar as preferências do banco quando não estão em cache', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockPreferencesService.getPreferences.mockResolvedValue(mockPreferences);

      const result = await controller.getPreferences(mockUserId);

      expect(service.getPreferences).toHaveBeenCalledWith(mockUserId);
      expect(mockCacheService.set).toHaveBeenCalledWith(
        `notification:preferences:${mockUserId}`,
        mockPreferences,
        300
      );
      expect(result).toEqual({
        status: 'success',
        data: mockPreferences
      });
    });

    it('deve retornar preferências vazias para novo usuário', async () => {
      const emptyPreferences = {
        userId: 'new-user',
        preferences: []
      };
      mockCacheService.get.mockResolvedValue(null);
      mockPreferencesService.getPreferences.mockResolvedValue(emptyPreferences);

      const result = await controller.getPreferences('new-user');

      expect(result.data.preferences).toHaveLength(0);
    });
  });

  describe('updateChannels', () => {
    it('deve atualizar preferência de canal e invalidar cache', async () => {
      const updateData: UpdateChannelsDto = {
        type: NotificationType.WORKOUT_REMINDER,
        channel: NotificationChannel.EMAIL,
        enabled: true
      };

      mockPreferencesService.updateChannels.mockResolvedValue(undefined);

      const result = await controller.updateChannels(mockUserId, updateData);

      expect(service.updateChannels).toHaveBeenCalledWith(
        mockUserId,
        updateData.type,
        updateData.channel,
        updateData.enabled
      );
      expect(mockCacheService.del).toHaveBeenCalledWith(
        `notification:preferences:${mockUserId}`
      );
      expect(result).toEqual({
        status: 'success',
        message: 'Preferência de canal atualizada com sucesso'
      });
    });
  });

  describe('toggleType', () => {
    it('deve alternar estado de um tipo de notificação e invalidar cache', async () => {
      const toggleData: ToggleTypeDto = {
        type: NotificationType.WORKOUT_REMINDER,
        enabled: false
      };

      mockPreferencesService.toggleType.mockResolvedValue(undefined);

      const result = await controller.toggleType(mockUserId, toggleData);

      expect(service.toggleType).toHaveBeenCalledWith(
        mockUserId,
        toggleData.type,
        toggleData.enabled
      );
      expect(mockCacheService.del).toHaveBeenCalledWith(
        `notification:preferences:${mockUserId}`
      );
      expect(result).toEqual({
        status: 'success',
        message: 'Tipo de notificação atualizado com sucesso'
      });
    });
  });

  describe('updateMany', () => {
    it('deve atualizar múltiplas preferências e invalidar cache', async () => {
      const updateData: UpdateManyDto = {
        preferences: [
          {
            type: NotificationType.WORKOUT_REMINDER,
            channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
            enabled: true
          },
          {
            type: NotificationType.ASSESSMENT_REMINDER,
            channels: [NotificationChannel.WHATSAPP],
            enabled: false
          }
        ]
      };

      mockPreferencesService.updateMany.mockResolvedValue(undefined);

      const result = await controller.updateMany(mockUserId, updateData);

      expect(service.updateMany).toHaveBeenCalledWith(mockUserId, updateData.preferences);
      expect(mockCacheService.del).toHaveBeenCalledWith(
        `notification:preferences:${mockUserId}`
      );
      expect(result).toEqual({
        status: 'success',
        message: 'Preferências atualizadas com sucesso'
      });
    });

    it('deve validar dados de atualização em massa', async () => {
      const invalidData: UpdateManyDto = {
        preferences: [
          {
            type: NotificationType.WORKOUT_REMINDER,
            channels: [], // Canais vazios devem ser rejeitados
            enabled: true
          }
        ]
      };

      mockPreferencesService.updateMany.mockRejectedValue(
        new Error('Ao menos um canal deve ser especificado')
      );

      await expect(
        controller.updateMany(mockUserId, invalidData)
      ).rejects.toThrow('Ao menos um canal deve ser especificado');
    });
  });
}); 