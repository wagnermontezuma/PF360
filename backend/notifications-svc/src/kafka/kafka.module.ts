import { Module, DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { KafkaOptions } from './kafka.interfaces';

@Module({})
export class KafkaModule {
  static register(options: KafkaOptions): DynamicModule {
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.register([
          {
            name: options.clientId,
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: options.clientId,
                brokers: [options.brokers],
              },
              consumer: {
                groupId: options.groupId || `${options.clientId}-group`,
              },
              producer: {
                allowAutoTopicCreation: true,
              },
            },
          },
        ]),
      ],
      providers: [
        {
          provide: 'KAFKA_OPTIONS',
          useValue: options,
        },
        KafkaService,
      ],
      exports: [KafkaService],
    };
  }
} 