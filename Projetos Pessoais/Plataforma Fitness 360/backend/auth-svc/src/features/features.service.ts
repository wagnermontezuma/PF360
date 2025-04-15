import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateFeatureFlagsDto } from './dto/update-feature-flags.dto';

@Injectable()
export class FeaturesService {
  constructor(private prisma: PrismaService) {}

  // Obtém as feature flags de um usuário
  async getUserFeatures(userId: string) {
    try {
      // Verificar se o usuário existe
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { featureFlags: true },
      });

      if (!user) {
        return { success: false, message: 'Usuário não encontrado' };
      }

      // Se o usuário não tiver registro de feature flags, criar um com valores padrão
      if (!user.featureFlags) {
        const defaultFeatures = await this.prisma.featureFlags.create({
          data: {
            userId,
            betaFeedback: false,
            improvementsSection: false,
            aiTrainingRecommendations: false,
            nutritionTracking: false,
            groupClasses: false,
            progressPictures: false,
            personalTrainerChat: false,
            challengeModule: false,
          },
        });

        return {
          success: true,
          features: defaultFeatures,
        };
      }

      // Retornar as feature flags existentes
      return {
        success: true,
        features: user.featureFlags,
      };
    } catch (error) {
      console.error('Erro ao obter feature flags:', error);
      return {
        success: false,
        message: 'Erro ao obter configurações de features',
        error: error.message,
      };
    }
  }

  // Atualiza as feature flags de um usuário
  async updateUserFeatures(userId: string, updateFeatureFlagsDto: UpdateFeatureFlagsDto) {
    try {
      // Verificar se o usuário existe
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { featureFlags: true },
      });

      if (!user) {
        return { success: false, message: 'Usuário não encontrado' };
      }

      // Se já existir um registro de feature flags, atualizar
      if (user.featureFlags) {
        const updatedFeatures = await this.prisma.featureFlags.update({
          where: { userId },
          data: updateFeatureFlagsDto,
        });

        return {
          success: true,
          features: updatedFeatures,
        };
      }

      // Se não existir, criar novo registro
      const newFeatures = await this.prisma.featureFlags.create({
        data: {
          userId,
          ...updateFeatureFlagsDto,
        },
      });

      return {
        success: true,
        features: newFeatures,
      };
    } catch (error) {
      console.error('Erro ao atualizar feature flags:', error);
      return {
        success: false,
        message: 'Erro ao atualizar configurações de features',
        error: error.message,
      };
    }
  }
} 