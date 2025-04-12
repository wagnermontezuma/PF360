import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { EmailService } from '../providers/email/email.service';
import { PushService } from '../providers/push/push.service';
import { WhatsAppService } from '../providers/whatsapp/whatsapp.service';
import { NotificationType, NotificationStatus, NotificationPriority } from '../enums/notification.enum';
import { SendNotificationDto } from '../dto/send-notification.dto';

@Injectable()
export class NotificationService {
  private readonly NOTIFICATION_GROUP_WINDOW = 5 * 60 * 1000; // 5 minutos

  constructor(
    private prisma: PrismaClient,
    private emailService: EmailService,
    private pushService: PushService,
    private whatsAppService: WhatsAppService,
    private configService: ConfigService,
  ) {}

  async sendNotification(data: SendNotificationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      await this.logNotification({
        ...data,
        status: NotificationStatus.FAILED,
        errorMessage: 'Usuário não encontrado',
      });
      return { status: NotificationStatus.FAILED };
    }

    const preferences = await this.prisma.notificationPreference.findFirst({
      where: { userId: data.userId },
    });

    // Verifica agrupamento de notificações similares
    const recentNotifications = await this.prisma.notification.findMany({
      where: {
        userId: data.userId,
        type: data.type,
        createdAt: {
          gte: new Date(Date.now() - this.NOTIFICATION_GROUP_WINDOW),
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });

    if (recentNotifications.length > 0) {
      const notification = recentNotifications[0];
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          groupCount: { increment: 1 },
          updatedAt: new Date(),
        },
      });
      return { status: NotificationStatus.GROUPED };
    }

    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        content: data.content,
        status: NotificationStatus.PENDING,
      },
    });

    const channels = {
      email: preferences?.email || data.priority === NotificationPriority.CRITICAL,
      push: preferences?.push || data.priority === NotificationPriority.CRITICAL,
      whatsapp: preferences?.whatsapp || data.priority === NotificationPriority.CRITICAL,
    };

    const results = await Promise.allSettled([
      channels.email && this.emailService.sendEmail({
        to: user.email,
        subject: data.title,
        html: this.formatEmailContent(data),
      }),
      channels.push && user.pushToken && this.pushService.sendPushNotification({
        token: user.pushToken,
        title: data.title,
        body: data.content,
      }),
      channels.whatsapp && user.phone && this.whatsAppService.sendMessage({
        to: user.phone,
        message: this.formatWhatsAppMessage(data),
      }),
    ].filter(Boolean));

    const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
    const totalAttempts = results.length;

    let status = NotificationStatus.SENT;
    let errorMessage = null;

    if (successCount === 0) {
      status = NotificationStatus.FAILED;
      errorMessage = 'Falha ao enviar por todos os canais';
    } else if (successCount < totalAttempts) {
      status = NotificationStatus.PARTIALLY_SENT;
      errorMessage = 'Falha ao enviar por alguns canais';
    }

    await this.prisma.notification.update({
      where: { id: notification.id },
      data: { status, errorMessage },
    });

    return { status };
  }

  async getUserNotifications(userId: string, options: { type?: NotificationType; page: number; limit: number }) {
    const { type, page, limit } = options;
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: {
          userId,
          ...(type && { type }),
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({
        where: {
          userId,
          ...(type && { type }),
        },
      }),
    ]);

    return {
      data: notifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        readAt: null,
      },
    });

    return { count };
  }

  async markAsRead(id: string) {
    await this.prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });

    return { success: true };
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return { success: true };
  }

  private formatEmailContent(data: SendNotificationDto): string {
    // Template básico, pode ser expandido com HTML mais elaborado
    return `
      <h2>${data.title}</h2>
      <p>${data.content}</p>
      <hr>
      <small>Plataforma Fitness 360</small>
    `;
  }

  private formatWhatsAppMessage(data: SendNotificationDto): string {
    return `*${data.title}*\n\n${data.content}`;
  }

  private async logNotification(data: any) {
    await this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        content: data.content,
        status: data.status,
        errorMessage: data.errorMessage,
      },
    });
  }
} 