import { Module } from '@nestjs/common';
import { NotificationPreferencesController } from './controllers/notification-preferences.controller';
import { NotificationPreferencesService } from './services/notification-preferences.service';
import { PrismaClient } from '@prisma/client';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [NotificationPreferencesController],
  providers: [
    NotificationPreferencesService,
    PrismaClient,
  ],
  exports: [NotificationPreferencesService],
})
export class NotificationsModule {} 