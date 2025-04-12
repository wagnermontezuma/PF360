import { Module } from '@nestjs/common';
import { NotificationPreferencesService } from './services/notification-preferences.service';
import { NotificationPreferencesController } from './controllers/notification-preferences.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationPreferencesController],
  providers: [NotificationPreferencesService],
  exports: [NotificationPreferencesService],
})
export class NotificationPreferencesModule {} 