import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';
import { WhatsAppOptions } from './interfaces/whatsapp-options.interface';

@Injectable()
export class WhatsAppService {
  private client: twilio.Twilio;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.client = twilio(accountSid, authToken);
  }

  async sendMessage(options: WhatsAppOptions): Promise<boolean> {
    try {
      const message = {
        body: options.message,
        from: `whatsapp:${this.configService.get<string>('TWILIO_WHATSAPP_NUMBER')}`,
        to: `whatsapp:${options.to}`,
      };

      if (options.mediaUrl) {
        Object.assign(message, { mediaUrl: options.mediaUrl });
      }

      await this.client.messages.create(message);
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem WhatsApp:', error);
      return false;
    }
  }
} 