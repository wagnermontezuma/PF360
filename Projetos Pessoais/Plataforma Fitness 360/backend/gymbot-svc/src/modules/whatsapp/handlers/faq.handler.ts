import { Injectable, Logger } from '@nestjs/common';
import { OpenAIService } from '../../ai/openai.service';
import { PrometheusService } from '../../../infrastructure/metrics/prometheus.service';
import { WhatsAppMessage } from '../interfaces/whatsapp-message.interface';
import { ConsentService } from '../../consent/consent.service';

@Injectable()
export class FAQHandler {
  private readonly logger = new Logger(FAQHandler.name);

  constructor(
    private readonly openAIService: OpenAIService,
    private readonly metricsService: PrometheusService,
    private readonly consentService: ConsentService,
  ) {}

  async handle(message: WhatsAppMessage): Promise<string> {
    const startTime = Date.now();
    try {
      const hasConsent = await this.consentService.hasOptIn(message.from);
      
      const prompt = `
        Você é o Gymbot, assistente virtual da academia Fit360.
        Responda de forma amigável e profissional.
        ${hasConsent ? 'Pode sugerir promoções.' : 'Não sugira promoções (opt-out).'}
        
        Pergunta do aluno: ${message.text}
      `;

      const response = await this.openAIService.complete(prompt);
      
      this.metricsService.recordGymBotLatency('faq', Date.now() - startTime);
      this.metricsService.incrementGymBotMessages('faq');
      
      return response;
    } catch (error) {
      this.logger.error(`Erro ao processar FAQ: ${error.message}`, error.stack);
      this.metricsService.incrementGymBotErrors('faq');
      throw error;
    }
  }
} 