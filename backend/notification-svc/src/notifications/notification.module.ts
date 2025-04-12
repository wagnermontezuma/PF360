import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { NotificationController } from './controllers/notification.controller';
import { NotificationService } from './services/notification.service';
import { EmailService } from './providers/email/email.service';
import { PushService } from './providers/push/push.service';
import { WhatsAppService } from './providers/whatsapp/whatsapp.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    EmailService,
    PushService,
    WhatsAppService,
    PrismaClient,
  ],
  exports: [NotificationService],
})
export class NotificationModule {} 