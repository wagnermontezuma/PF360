import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NutritionService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.nutritionPlan.findMany({
      where: { userId },
      include: {
        meals: {
          include: {
            foods: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.nutritionPlan.findUnique({
      where: { id, userId },
      include: {
        meals: {
          include: {
            foods: true,
          },
        },
      },
    });
  }

  async create(data: any, userId: string) {
    return this.prisma.nutritionPlan.create({
      data: {
        ...data,
        userId,
        meals: {
          create: data.meals?.map(meal => ({
            name: meal.name,
            time: meal.time,
            foods: {
              create: meal.foods?.map(food => ({
                name: food.name,
                quantity: food.quantity,
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fats: food.fats,
              })),
            },
          })),
        },
      },
      include: {
        meals: {
          include: {
            foods: true,
          },
        },
      },
    });
  }

  async update(id: string, data: any, userId: string) {
    // Primeiro verificamos se o plano pertence ao usuário
    const plan = await this.prisma.nutritionPlan.findUnique({
      where: { id, userId },
    });

    if (!plan) {
      return null;
    }

    // Atualizamos o plano básico
    return this.prisma.nutritionPlan.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        calorieTarget: data.calorieTarget,
        proteinTarget: data.proteinTarget,
        carbsTarget: data.carbsTarget,
        fatsTarget: data.fatsTarget,
      },
      include: {
        meals: {
          include: {
            foods: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    // Verificamos se o plano pertence ao usuário
    const plan = await this.prisma.nutritionPlan.findUnique({
      where: { id, userId },
    });

    if (!plan) {
      return null;
    }

    // Deletamos o plano e suas relações
    return this.prisma.nutritionPlan.delete({
      where: { id },
    });
  }

  async updateMeals(planId: string, meals: any[], userId: string) {
    // Verificamos se o plano pertence ao usuário
    const plan = await this.prisma.nutritionPlan.findUnique({
      where: { id: planId, userId },
    });

    if (!plan) {
      return null;
    }

    // Deletamos todas as refeições existentes
    await this.prisma.meal.deleteMany({
      where: { nutritionPlanId: planId },
    });

    // Criamos as novas refeições
    for (const meal of meals) {
      await this.prisma.meal.create({
        data: {
          nutritionPlanId: planId,
          name: meal.name,
          time: meal.time,
          foods: {
            create: meal.foods?.map(food => ({
              name: food.name,
              quantity: food.quantity,
              calories: food.calories,
              protein: food.protein,
              carbs: food.carbs,
              fats: food.fats,
            })),
          },
        },
      });
    }

    // Retornamos o plano atualizado
    return this.prisma.nutritionPlan.findUnique({
      where: { id: planId },
      include: {
        meals: {
          include: {
            foods: true,
          },
        },
      },
    });
  }

  async getCaloriesStatistics(userId: string, startDate: Date, endDate: Date) {
    // Buscar todos os planos nutricionais ativos no período
    const plans = await this.prisma.nutritionPlan.findMany({
      where: {
        userId,
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
      include: {
        meals: {
          include: {
            foods: true,
          },
        },
      },
    });

    // Calcular estatísticas de calorias
    const statistics = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      averageDailyCalories: 0,
      plansCount: plans.length,
    };

    plans.forEach(plan => {
      plan.meals.forEach(meal => {
        meal.foods.forEach(food => {
          statistics.totalCalories += food.calories || 0;
          statistics.totalProtein += food.protein || 0;
          statistics.totalCarbs += food.carbs || 0;
          statistics.totalFats += food.fats || 0;
        });
      });
    });

    // Calcular média diária
    const days = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    statistics.averageDailyCalories = statistics.totalCalories / days;

    return statistics;
  }
} 