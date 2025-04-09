import { OnModuleInit } from '@nestjs/common';
export declare class KafkaService implements OnModuleInit {
    private readonly client;
    onModuleInit(): Promise<void>;
    emit(topic: string, message: any): Promise<void>;
}
