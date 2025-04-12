import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaMessage, KafkaOptions } from './kafka.interfaces';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly logger = new Logger(KafkaService.name);

  constructor(
    @Inject('KAFKA_OPTIONS') private readonly options: KafkaOptions,
    @Inject('notifications-service') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    // Verificamos se o cliente Kafka está conectado antes de prosseguir
    await this.client.connect();
    this.logger.log(`Kafka client '${this.options.clientId}' connected successfully`);
  }

  /**
   * Envia uma mensagem para um tópico Kafka
   */
  async emit<T = any>(message: KafkaMessage<T>): Promise<void> {
    try {
      const { topic, key, value, headers, partition } = message;
      this.logger.debug(`Sending message to topic ${topic}`, {
        key,
        value: JSON.stringify(value),
      });
      
      await this.client.emit(topic, {
        key,
        value: JSON.stringify(value),
        headers,
        partition,
      }).toPromise();
      
      this.logger.debug(`Message sent successfully to topic ${topic}`);
    } catch (error) {
      this.logger.error(
        `Error sending message to Kafka: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Registra um consumidor para um tópico Kafka
   */
  subscribe<T>(topic: string, callback: (value: T) => Promise<void>): void {
    this.client.subscribeToResponseOf(topic);
    
    this.logger.log(`Subscribed to topic: ${topic}`);
    
    this.client.connect().then(() => {
      this.client.consume(topic, async (message) => {
        try {
          const value = message.value ? JSON.parse(message.value.toString()) : null;
          this.logger.debug(`Received message from topic ${topic}`, { value });
          
          await callback(value);
        } catch (error) {
          this.logger.error(
            `Error processing message from topic ${topic}: ${error.message}`,
            error.stack,
          );
        }
      });
    });
  }
} 