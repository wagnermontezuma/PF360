import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from './kafka/kafka.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    KafkaModule.register({
      clientId: 'notifications-service',
      brokers: process.env.KAFKA_BROKERS || 'localhost:9092',
      groupId: 'notifications-consumer-group',
    }),
    NotificationsModule,
  ],
})
export class AppModule {} 