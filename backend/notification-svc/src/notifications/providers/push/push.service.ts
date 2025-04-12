import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { PushOptions } from './interfaces/push-options.interface';

@Injectable()
export class PushService {
  constructor(private configService: ConfigService) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
          clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
          privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY'),
        }),
      });
    }
  }

  async sendPushNotification(options: PushOptions): Promise<boolean> {
    try {
      const message = {
        notification: {
          title: options.title,
          body: options.body,
        },
        data: options.data,
        token: options.token,
      };

      await admin.messaging().send(message);
      return true;
    } catch (error) {
      console.error('Erro ao enviar push notification:', error);
      return false;
    }
  }
} 