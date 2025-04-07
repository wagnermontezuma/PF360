import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private readonly kafka: Kafka;
  private producer: Producer;
  private readonly logger = new Logger(KafkaService.name);

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'billing-service',
      brokers: this.configService.get<string>('KAFKA_BROKERS').split(','),
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      this.logger.log('Conexão com Kafka estabelecida');
    } catch (error) {
      this.logger.error('Erro ao conectar com Kafka:', error.stack);
      throw error;
    }
  }

  async emit(topic: string, message: any): Promise<void> {
    try {
      await this.producer.send({
        topic,
        messages: [
          {
            value: JSON.stringify(message),
            headers: {
              'content-type': 'application/json',
              timestamp: Date.now().toString(),
            },
          },
        ],
      });
    } catch (error) {
      this.logger.error(`Erro ao enviar mensagem para tópico ${topic}:`, error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.producer.disconnect();
      this.logger.log('Conexão com Kafka encerrada');
    } catch (error) {
      this.logger.error('Erro ao desconectar do Kafka:', error.stack);
    }
  }
} 