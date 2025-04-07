import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaService implements OnModuleInit {
  private producer: Producer;

  constructor(private configService: ConfigService) {
    const kafka = new Kafka({
      clientId: 'members-service',
      brokers: this.configService.get<string>('KAFKA_BROKERS').split(','),
      ssl: this.configService.get<boolean>('KAFKA_SSL'),
      sasl: {
        mechanism: 'plain',
        username: this.configService.get<string>('KAFKA_USERNAME'),
        password: this.configService.get<string>('KAFKA_PASSWORD'),
      },
    });

    this.producer = kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async emit(topic: string, message: any) {
    await this.producer.send({
      topic,
      messages: [
        { 
          value: JSON.stringify(message),
          headers: {
            'content-type': 'application/json',
            'source': 'members-service',
          }
        },
      ],
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }
} 