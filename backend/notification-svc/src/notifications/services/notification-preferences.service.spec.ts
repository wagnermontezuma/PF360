import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { NotificationPreferencesService } from './notification-preferences.service';
import { NotificationChannel } from '../enums/notification.enum';

describe('NotificationPreferencesService', () => {
  let service: NotificationPreferencesService;
  let prisma: PrismaClient;

  const mockUserId = 'user-123';
  const mockPreference = {
    userId: mockUserId,
    email: true,
    push: true,
    whatsapp: true,
    allowedStartTime: '08:00',
    allowedEndTime: '22:00',
    channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
    mutedUntil: null,
  };

  const mockPrisma = {
    $queryRaw: jest.fn(),
    $executeRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationPreferencesService,
        {
          provide: PrismaClient,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<NotificationPreferencesService>(NotificationPreferencesService);
    prisma = module.get<PrismaClient>(PrismaClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPreferences', () => {
    it('deve retornar as preferências do usuário', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([mockPreference]);
      
      const result = await service.getPreferences(mockUserId);
      
      expect(result).toEqual([mockPreference]);
      expect(mockPrisma.$queryRaw).toHaveBeenCalled();
    });

    it('deve retornar array vazio quando usuário não tem preferências', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([]);
      
      const result = await service.getPreferences(mockUserId);
      
      expect(result).toEqual([]);
    });
  });

  describe('updatePreferences', () => {
    it('deve atualizar preferências existentes', async () => {
      const updateData = {
        email: false,
        allowedStartTime: '09:00',
      };

      await service.updatePreferences(mockUserId, updateData);

      expect(mockPrisma.$executeRaw).toHaveBeenCalled();
    });

    it('deve criar novas preferências com valores padrão', async () => {
      const newData = {
        email: true,
      };

      await service.updatePreferences(mockUserId, newData);

      expect(mockPrisma.$executeRaw).toHaveBeenCalled();
    });
  });

  describe('isChannelEnabled', () => {
    it('deve retornar true quando usuário não tem preferências', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([]);

      const result = await service.isChannelEnabled(mockUserId, NotificationChannel.EMAIL);

      expect(result).toBe(true);
    });

    it('deve retornar false quando notificações estão silenciadas', async () => {
      const mutedPreference = {
        ...mockPreference,
        mutedUntil: new Date(Date.now() + 60000), // 1 minuto no futuro
      };
      mockPrisma.$queryRaw.mockResolvedValue([mutedPreference]);

      const result = await service.isChannelEnabled(mockUserId, NotificationChannel.EMAIL);

      expect(result).toBe(false);
    });

    it('deve retornar false quando fora do horário permitido', async () => {
      const preference = {
        ...mockPreference,
        allowedStartTime: '14:00',
        allowedEndTime: '16:00',
      };
      mockPrisma.$queryRaw.mockResolvedValue([preference]);

      // Mock da data atual para um horário fora do permitido
      jest.spyOn(global, 'Date').mockImplementation(() => 
        new Date('2024-01-01T13:00:00Z')
      );

      const result = await service.isChannelEnabled(mockUserId, NotificationChannel.EMAIL);

      expect(result).toBe(false);
    });

    it('deve retornar true quando canal está habilitado e dentro do horário', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([mockPreference]);

      const result = await service.isChannelEnabled(mockUserId, NotificationChannel.EMAIL);

      expect(result).toBe(true);
    });
  });

  describe('muteNotifications', () => {
    it('deve silenciar notificações pelo tempo especificado', async () => {
      const duration = 30; // 30 minutos
      
      await service.muteNotifications(mockUserId, duration);

      expect(mockPrisma.$executeRaw).toHaveBeenCalled();
    });
  });

  describe('unmuteNotifications', () => {
    it('deve reativar notificações', async () => {
      await service.unmuteNotifications(mockUserId);

      expect(mockPrisma.$executeRaw).toHaveBeenCalled();
    });
  });
}); 