import { Injectable } from '@nestjs/common';
import { KafkaClient, Consumer, Producer } from 'kafka-node';

@Injectable()
export class KafkaService {
  private readonly client: KafkaClient;
  private readonly consumer: Consumer;
  private readonly producer: Producer;

  constructor(
    @Inject('KAFKA_OPTIONS')
    private readonly options: {
      clientId: string;
      brokers: string[];
      groupId: string;
    }
  ) {
    this.client = new KafkaClient({
      clientId: this.options.clientId,
      brokers: this.options.brokers
    });

    this.consumer = new Consumer(
      this.client,
      [],
      {
        groupId: this.options.groupId,
        autoCommit: true
      }
    );

    this.producer = new Producer(this.client);
  }

  async consumeEvents(topic: string, callback: (message: any) => Promise<void>) {
    this.consumer.on('message', async (message) => {
      try {
        await callback(message);
      } catch (error) {
        console.error(`Error processing message from ${topic}:`, error);
      }
    });

    this.consumer.on('error', (error) => {
      console.error(`Kafka consumer error for ${topic}:`, error);
    });
  }

  async produceEvent(topic: string, message: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.producer.send([
        {
          topic,
          messages: JSON.stringify(message)
        }
      ], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
} 