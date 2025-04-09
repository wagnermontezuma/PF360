import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

@Injectable()
export class KafkaService implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'members-service',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'members-consumer-group',
      },
    },
  })
  private readonly client: ClientKafka;

  async onModuleInit() {
    await this.client.connect();
  }

  async emit(topic: string, message: any) {
    try {
      await this.client.emit(topic, message).toPromise();
    } catch (error) {
      console.error(`Erro ao emitir evento Kafka: ${error.message}`);
      throw error;
    }
  }
} 