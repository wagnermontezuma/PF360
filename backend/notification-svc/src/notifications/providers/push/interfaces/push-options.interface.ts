export interface PushOptions {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  image?: string;
  icon?: string;
  clickAction?: string;
} 