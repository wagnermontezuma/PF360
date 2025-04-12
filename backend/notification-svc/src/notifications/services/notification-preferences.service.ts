import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NotificationType, NotificationChannel } from '../enums/notification.enum';
import { CacheService } from '../../cache/cache.service';

interface NotificationPreference {
  type: NotificationType;
  channels: NotificationChannel[];
  enabled: boolean;
}

@Injectable()
export class NotificationPreferencesService {
  private readonly CACHE_PREFIX = 'notification:preferences';
  private readonly CACHE_TTL = 300; // 5 minutos

  constructor(
    private readonly prisma: PrismaClient,
    private readonly cacheService: CacheService,
  ) {}

  async getPreferences(userId: string) {
    // Tenta buscar do cache primeiro
    const cacheKey = this.cacheService.generateKey(this.CACHE_PREFIX, userId);
    const cached = await this.cacheService.get<{
      userId: string;
      preferences: NotificationPreference[];
    }>(cacheKey);

    if (cached) {
      return cached;
    }

    // Se não estiver em cache, busca do banco
    const preferences = await this.prisma.$queryRaw<{
      type: NotificationType;
      channels: NotificationChannel[];
      enabled: boolean;
    }[]>`
      SELECT type, channels, enabled
      FROM "NotificationPreferences"
      WHERE "userId" = ${userId}
      ORDER BY type
    `;

    const result = {
      userId,
      preferences: preferences || [],
    };

    // Salva no cache
    await this.cacheService.set(cacheKey, result, this.CACHE_TTL);

    return result;
  }

  async updateChannels(
    userId: string,
    type: NotificationType,
    channel: NotificationChannel,
    enabled: boolean,
  ) {
    const result = await this.prisma.$executeRaw`
      UPDATE "NotificationPreferences"
      SET channels = CASE
        WHEN ${enabled} THEN
          CASE
            WHEN channels @> ARRAY[${channel}]::notification_channel[] THEN channels
            ELSE array_append(channels, ${channel}::notification_channel)
          END
        ELSE
          array_remove(channels, ${channel}::notification_channel)
      END
      WHERE "userId" = ${userId}
      AND type = ${type}::notification_type
    `;

    // Invalida o cache após atualização
    const cacheKey = this.cacheService.generateKey(this.CACHE_PREFIX, userId);
    await this.cacheService.del(cacheKey);

    return result;
  }

  async toggleType(
    userId: string,
    type: NotificationType,
    enabled: boolean,
  ) {
    const result = await this.prisma.$executeRaw`
      INSERT INTO "NotificationPreferences" ("userId", type, enabled, channels)
      VALUES (
        ${userId},
        ${type}::notification_type,
        ${enabled},
        ARRAY[]::notification_channel[]
      )
      ON CONFLICT ("userId", type)
      DO UPDATE SET enabled = ${enabled}
    `;

    // Invalida o cache após atualização
    const cacheKey = this.cacheService.generateKey(this.CACHE_PREFIX, userId);
    await this.cacheService.del(cacheKey);

    return result;
  }

  async updateMany(
    userId: string,
    preferences: NotificationPreference[],
  ) {
    // Valida se há ao menos um canal para preferências habilitadas
    preferences.forEach(pref => {
      if (pref.enabled && (!pref.channels || pref.channels.length === 0)) {
        throw new Error('Ao menos um canal deve ser especificado');
      }
    });

    // Atualiza em transação
    const result = await this.prisma.$transaction(
      preferences.map(pref => 
        this.prisma.$executeRaw`
          INSERT INTO "NotificationPreferences" ("userId", type, enabled, channels)
          VALUES (
            ${userId},
            ${pref.type}::notification_type,
            ${pref.enabled},
            ${pref.channels}::notification_channel[]
          )
          ON CONFLICT ("userId", type)
          DO UPDATE SET
            enabled = ${pref.enabled},
            channels = ${pref.channels}::notification_channel[]
        `
      )
    );

    // Invalida o cache após atualização
    const cacheKey = this.cacheService.generateKey(this.CACHE_PREFIX, userId);
    await this.cacheService.del(cacheKey);

    return result;
  }
} 