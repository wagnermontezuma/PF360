export interface WhatsAppOptions {
  to: string;
  message: string;
  mediaUrl?: string;
  templateName?: string;
  templateData?: Record<string, string>;
} 