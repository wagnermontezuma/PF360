export interface KafkaOptions {
  clientId: string;
  brokers: string;
  groupId?: string;
}

export interface KafkaMessage<T = any> {
  topic: string;
  key?: string;
  value: T;
  headers?: Record<string, any>;
  partition?: number;
}

export enum KafkaTopics {
  FEEDBACK_CREATED = 'feedback-events',
  BILLING_CREATED = 'billing-events',
  MEMBER_CREATED = 'member-events',
  NOTIFICATION_SENT = 'notification-events',
} 