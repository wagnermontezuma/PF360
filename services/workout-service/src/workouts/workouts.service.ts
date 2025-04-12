import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWorkoutDto: CreateWorkoutDto) {
    return this.prisma.workout.create({
      data: createWorkoutDto,
      include: {
        exercises: true,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.workout.findMany({
      where: { userId },
      include: {
        exercises: {
          include: {
            equipment: true,
            muscleGroups: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            equipment: true,
            muscleGroups: true,
          },
        },
      },
    });

    if (!workout) {
      throw new NotFoundException(`Treino com ID ${id} não encontrado`);
    }

    return workout;
  }

  async update(id: string, updateWorkoutDto: UpdateWorkoutDto) {
    try {
      return await this.prisma.workout.update({
        where: { id },
        data: updateWorkoutDto,
        include: {
          exercises: {
            include: {
              equipment: true,
              muscleGroups: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Treino com ID ${id} não encontrado`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.workout.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Treino com ID ${id} não encontrado`);
    }
  }

  async findTemplates() {
    return this.prisma.workout.findMany({
      where: { isTemplate: true },
      include: {
        exercises: {
          include: {
            equipment: true,
            muscleGroups: true,
          },
        },
      },
    });
  }
}
