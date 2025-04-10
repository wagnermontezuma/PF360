import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaService, KafkaTopics } from '../kafka';

interface NotificationPayload {
  userId: string;
  title: string;
  content: string;
  type: 'EMAIL' | 'PUSH' | 'SMS' | 'IN_APP';
}

interface FeedbackNotificationPayload {
  id: string;
  userId: string;
  nota: number;
  comentario: string;
  createdAt: Date;
}

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly kafkaService: KafkaService) {}

  async onModuleInit() {
    // Registrar consumidores para tópicos relevantes
    this.subscribeToFeedbackEvents();
    this.subscribeToBillingEvents();
  }

  async sendNotification(payload: NotificationPayload): Promise<void> {
    this.logger.log(`Sending ${payload.type} notification to user ${payload.userId}: ${payload.title}`);
    
    // Aqui implementaríamos a lógica real para enviar a notificação
    // por exemplo, enviar email, push notification, etc.
    
    // Simular um atraso para processamento
    await new Promise(resolve => setTimeout(resolve, 100));
    
    this.logger.log(`Notification sent successfully to user ${payload.userId}`);
    
    // Emitir evento de notificação enviada
    await this.kafkaService.emit({
      topic: KafkaTopics.NOTIFICATION_SENT,
      value: {
        userId: payload.userId,
        type: payload.type,
        title: payload.title,
        sentAt: new Date(),
      },
    });
  }
  
  private subscribeToFeedbackEvents(): void {
    this.kafkaService.subscribe<FeedbackNotificationPayload>(
      KafkaTopics.FEEDBACK_CREATED, 
      async (payload) => {
        this.logger.log(`Received feedback event for user ${payload.userId}`);
        
        // Criar uma notificação para o administrador sobre o novo feedback
        await this.sendNotification({
          userId: 'admin', // Aqui seria o ID do administrador
          title: 'Novo feedback recebido',
          content: `Um usuário enviou um feedback com nota ${payload.nota}. Comentário: ${payload.comentario}`,
          type: 'EMAIL',
        });
        
        // Também podemos notificar o usuário que seu feedback foi recebido
        await this.sendNotification({
          userId: payload.userId,
          title: 'Seu feedback foi recebido',
          content: 'Agradecemos por compartilhar sua opinião conosco. Nosso time irá analisar seu feedback.',
          type: 'IN_APP',
        });
      }
    );
  }
  
  private subscribeToBillingEvents(): void {
    this.kafkaService.subscribe(
      KafkaTopics.BILLING_CREATED, 
      async (payload) => {
        this.logger.log(`Received billing event for user ${payload.userId}`);
        
        // Notificar o usuário sobre a nova fatura
        await this.sendNotification({
          userId: payload.userId,
          title: 'Nova fatura disponível',
          content: `Sua fatura no valor de R$ ${payload.valor.toFixed(2)} está disponível para pagamento.`,
          type: 'EMAIL',
        });
      }
    );
  }
} 