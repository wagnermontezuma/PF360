import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from './notification.service';
import { EmailService } from '../providers/email/email.service';
import { PushService } from '../providers/push/push.service';
import { WhatsAppService } from '../providers/whatsapp/whatsapp.service';
import { NotificationType, NotificationStatus, NotificationPriority } from '../enums/notification.enum';

describe('NotificationService Integration', () => {
  let module: TestingModule;
  let notificationService: NotificationService;
  let prisma: PrismaClient;
  let emailService: EmailService;
  let pushService: PushService;
  let whatsAppService: WhatsAppService;

  const mockUser = {
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
    phone: '+5511999999999',
    pushToken: 'mock-push-token',
  };

  const mockPreferences = {
    id: '456',
    userId: mockUser.id,
    email: true,
    push: true,
    whatsapp: true,
  };

  const mockPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    notificationPreference: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    },
    $transaction: (fn: () => Promise<any>) => fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaClient,
          useValue: mockPrismaClient,
        },
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
        {
          provide: PushService,
          useValue: {
            sendPushNotification: jest.fn(),
          },
        },
        {
          provide: WhatsAppService,
          useValue: {
            sendMessage: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
    prisma = module.get<PrismaClient>(PrismaClient);
    emailService = module.get<EmailService>(EmailService);
    pushService = module.get<PushService>(PushService);
    whatsAppService = module.get<WhatsAppService>(WhatsAppService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock responses
    mockPrismaClient.user.findUnique.mockResolvedValue(mockUser);
    mockPrismaClient.notificationPreference.findFirst.mockResolvedValue(mockPreferences);
    mockPrismaClient.notification.create.mockImplementation((args) => ({
      id: 'new-notification-id',
      ...args.data,
    }));
    (emailService.sendEmail as jest.Mock).mockResolvedValue(true);
    (pushService.sendPushNotification as jest.Mock).mockResolvedValue(true);
    (whatsAppService.sendMessage as jest.Mock).mockResolvedValue(true);
  });

  describe('sendNotification', () => {
    it('deve enviar notificação por todos os canais habilitados', async () => {
      const notificationData = {
        userId: mockUser.id,
        type: NotificationType.TRAINING_REMINDER,
        title: 'Lembrete de Treino',
        content: 'Seu treino começa em 30 minutos',
        priority: NotificationPriority.MEDIUM,
      };

      const result = await notificationService.sendNotification(notificationData);

      expect(result.status).toBe(NotificationStatus.SENT);
      expect(emailService.sendEmail).toHaveBeenCalled();
      expect(pushService.sendPushNotification).toHaveBeenCalled();
      expect(whatsAppService.sendMessage).toHaveBeenCalled();
    });

    it('deve agrupar notificações similares dentro da janela de tempo', async () => {
      mockPrismaClient.notification.findMany.mockResolvedValue([
        {
          id: 'existing-notification',
          groupCount: 1,
          createdAt: new Date(),
        },
      ]);

      const notificationData = {
        userId: mockUser.id,
        type: NotificationType.TRAINING_REMINDER,
        title: 'Lembrete de Treino',
        content: 'Novo lembrete',
      };

      const result = await notificationService.sendNotification(notificationData);

      expect(result.status).toBe(NotificationStatus.GROUPED);
      expect(mockPrismaClient.notification.update).toHaveBeenCalledWith({
        where: { id: 'existing-notification' },
        data: expect.objectContaining({
          groupCount: expect.any(Object),
        }),
      });
    });

    it('deve lidar com falha parcial no envio', async () => {
      (emailService.sendEmail as jest.Mock).mockRejectedValue(new Error('Falha no envio'));
      
      const notificationData = {
        userId: mockUser.id,
        type: NotificationType.SYSTEM_UPDATE,
        title: 'Teste',
        content: 'Conteúdo',
      };

      const result = await notificationService.sendNotification(notificationData);

      expect(result.status).toBe(NotificationStatus.PARTIALLY_SENT);
    });
  });

  describe('getUserNotifications', () => {
    it('deve retornar notificações paginadas', async () => {
      const mockNotifications = [
        { id: '1', title: 'Notificação 1' },
        { id: '2', title: 'Notificação 2' },
      ];

      mockPrismaClient.notification.findMany.mockResolvedValue(mockNotifications);
      mockPrismaClient.notification.count.mockResolvedValue(2);

      const result = await notificationService.getUserNotifications(mockUser.id, {
        page: 1,
        limit: 10,
      });

      expect(result.data).toEqual(mockNotifications);
      expect(result.meta).toEqual({
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('markAsRead', () => {
    it('deve marcar uma notificação como lida', async () => {
      const notificationId = 'notification-id';
      
      await notificationService.markAsRead(notificationId);

      expect(mockPrismaClient.notification.update).toHaveBeenCalledWith({
        where: { id: notificationId },
        data: expect.objectContaining({
          readAt: expect.any(Date),
        }),
      });
    });
  });

  describe('markAllAsRead', () => {
    it('deve marcar todas as notificações do usuário como lidas', async () => {
      await notificationService.markAllAsRead(mockUser.id);

      expect(mockPrismaClient.notification.updateMany).toHaveBeenCalledWith({
        where: {
          userId: mockUser.id,
          readAt: null,
        },
        data: expect.objectContaining({
          readAt: expect.any(Date),
        }),
      });
    });
  });
}); 