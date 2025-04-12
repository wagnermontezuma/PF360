import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NotificationType } from '../enums/notification.enum';

interface TemplateVariables {
  [key: string]: string | number | boolean;
}

@Injectable()
export class NotificationTemplateService {
  constructor(private readonly prisma: PrismaClient) {}

  async getTemplate(type: NotificationType, language = 'pt-BR') {
    return this.prisma.$queryRaw<{
      id: string;
      type: NotificationType;
      title: string;
      content: string;
      language: string;
      variables: string[];
    }[]>`
      SELECT * FROM "NotificationTemplate"
      WHERE "type" = ${type}
      AND "language" = ${language}
      LIMIT 1
    `;
  }

  async createTemplate(data: {
    type: NotificationType;
    title: string;
    content: string;
    language?: string;
    variables: string[];
  }) {
    return this.prisma.$executeRaw`
      INSERT INTO "NotificationTemplate" (
        "type", "title", "content", "language", "variables"
      ) VALUES (
        ${data.type},
        ${data.title},
        ${data.content},
        ${data.language || 'pt-BR'},
        ${data.variables}
      )
      ON CONFLICT ("type", "language")
      DO UPDATE SET
        "title" = EXCLUDED."title",
        "content" = EXCLUDED."content",
        "variables" = EXCLUDED."variables"
    `;
  }

  async renderTemplate(
    type: NotificationType,
    variables: TemplateVariables,
    language = 'pt-BR',
  ) {
    const [template] = await this.getTemplate(type, language);
    if (!template) {
      throw new Error(`Template não encontrado para o tipo ${type} e idioma ${language}`);
    }

    let { title, content } = template;

    // Substitui variáveis no título e conteúdo
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      title = title.replace(regex, String(value));
      content = content.replace(regex, String(value));
    });

    // Valida se todas as variáveis foram substituídas
    const missingVariables = [
      ...title.matchAll(/{{(\w+)}}/g),
      ...content.matchAll(/{{(\w+)}}/g),
    ].map(match => match[1]);

    if (missingVariables.length > 0) {
      throw new Error(`Variáveis obrigatórias não fornecidas: ${missingVariables.join(', ')}`);
    }

    return { title, content };
  }

  async deleteTemplate(type: NotificationType, language = 'pt-BR') {
    return this.prisma.$executeRaw`
      DELETE FROM "NotificationTemplate"
      WHERE "type" = ${type}
      AND "language" = ${language}
    `;
  }

  async listTemplates(language = 'pt-BR') {
    return this.prisma.$queryRaw<{
      id: string;
      type: NotificationType;
      title: string;
      content: string;
      language: string;
      variables: string[];
    }[]>`
      SELECT * FROM "NotificationTemplate"
      WHERE "language" = ${language}
      ORDER BY "type"
    `;
  }
} 