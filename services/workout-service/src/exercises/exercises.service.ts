import {
  Injectable,
  NotFoundException,
  Logger,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  private readonly logger = new Logger(ExercisesService.name);
  private readonly CACHE_PREFIX = 'exercise:';
  private readonly CACHE_TTL = 3600; // 1 hora em segundos

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createExerciseDto: CreateExerciseDto) {
    this.logger.log({
      message: 'Creating new exercise',
      data: createExerciseDto,
    });

    try {
      const exercise = await this.prisma.exercise.create({
        data: {
          name: createExerciseDto.name,
          description: createExerciseDto.description,
          instructions: createExerciseDto.instructions,
          videoUrl: createExerciseDto.videoUrl,
          equipment: {
            connect:
              createExerciseDto.equipmentIds?.map((id) => ({ id })) || [],
          },
          muscleGroups: {
            connect: createExerciseDto.muscleGroupIds.map((id) => ({ id })),
          },
        },
        include: {
          equipment: true,
          muscleGroups: true,
        },
      });

      // Invalidar cache após criar
      await this.invalidateCache();

      this.logger.log({
        message: 'Exercise created successfully',
        exerciseId: exercise.id,
      });

      return exercise;
    } catch (error) {
      if (error.code === 'P2002') {
        this.logger.error({
          message: 'Exercise name already exists',
          data: createExerciseDto,
          error,
        });
        throw new Error('Já existe um exercício com este nome');
      }
      if (error.code === 'P2025') {
        this.logger.error({
          message: 'Related equipment or muscle groups not found',
          data: createExerciseDto,
          error,
        });
        throw new Error('Equipamento ou grupo muscular não encontrado');
      }
      this.logger.error({
        message: 'Error creating exercise',
        data: createExerciseDto,
        error,
      });
      throw error;
    }
  }

  async findAll() {
    this.logger.log('Fetching all exercises');

    // Tentar obter do cache
    const cachedExercises = await this.cacheManager.get('exercises:all');
    if (cachedExercises) {
      this.logger.log('Returning exercises from cache');
      return cachedExercises;
    }

    const exercises = await this.prisma.exercise.findMany({
      include: {
        equipment: true,
        muscleGroups: true,
      },
    });

    // Salvar no cache
    await this.cacheManager.set('exercises:all', exercises, this.CACHE_TTL);

    return exercises;
  }

  async findOne(id: string) {
    this.logger.log({
      message: 'Fetching exercise by id',
      exerciseId: id,
    });

    // Tentar obter do cache
    const cacheKey = `${this.CACHE_PREFIX}${id}`;
    const cachedExercise = await this.cacheManager.get(cacheKey);
    if (cachedExercise) {
      this.logger.log({
        message: 'Returning exercise from cache',
        exerciseId: id,
      });
      return cachedExercise;
    }

    const exercise = await this.prisma.exercise.findUnique({
      where: { id },
      include: {
        equipment: true,
        muscleGroups: true,
      },
    });

    if (!exercise) {
      this.logger.warn({
        message: 'Exercise not found',
        exerciseId: id,
      });
      throw new NotFoundException(`Exercício com ID ${id} não encontrado`);
    }

    // Salvar no cache
    await this.cacheManager.set(cacheKey, exercise, this.CACHE_TTL);

    return exercise;
  }

  async update(id: string, updateExerciseDto: UpdateExerciseDto) {
    this.logger.log({
      message: 'Updating exercise',
      exerciseId: id,
      data: updateExerciseDto,
    });

    try {
      const exercise = await this.prisma.exercise.update({
        where: { id },
        data: {
          name: updateExerciseDto.name,
          description: updateExerciseDto.description,
          instructions: updateExerciseDto.instructions,
          videoUrl: updateExerciseDto.videoUrl,
          equipment: updateExerciseDto.equipmentIds
            ? {
                set: [],
                connect: updateExerciseDto.equipmentIds.map((id) => ({ id })),
              }
            : undefined,
          muscleGroups: updateExerciseDto.muscleGroupIds
            ? {
                set: [],
                connect: updateExerciseDto.muscleGroupIds.map((id) => ({ id })),
              }
            : undefined,
        },
        include: {
          equipment: true,
          muscleGroups: true,
        },
      });

      // Invalidar cache após atualizar
      await this.invalidateCache(id);

      this.logger.log({
        message: 'Exercise updated successfully',
        exerciseId: id,
      });

      return exercise;
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn({
          message: 'Exercise not found for update',
          exerciseId: id,
          error,
        });
        throw new NotFoundException(`Exercício com ID ${id} não encontrado`);
      }
      if (error.code === 'P2002') {
        this.logger.error({
          message: 'Exercise name already exists',
          exerciseId: id,
          data: updateExerciseDto,
          error,
        });
        throw new Error('Já existe um exercício com este nome');
      }
      this.logger.error({
        message: 'Error updating exercise',
        exerciseId: id,
        data: updateExerciseDto,
        error,
      });
      throw error;
    }
  }

  async remove(id: string) {
    this.logger.log({
      message: 'Removing exercise',
      exerciseId: id,
    });

    try {
      const exercise = await this.prisma.exercise.delete({
        where: { id },
        include: {
          equipment: true,
          muscleGroups: true,
        },
      });

      // Invalidar cache após remover
      await this.invalidateCache(id);

      this.logger.log({
        message: 'Exercise removed successfully',
        exerciseId: id,
      });

      return exercise;
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn({
          message: 'Exercise not found for removal',
          exerciseId: id,
          error,
        });
        throw new NotFoundException(`Exercício com ID ${id} não encontrado`);
      }
      this.logger.error({
        message: 'Error removing exercise',
        exerciseId: id,
        error,
      });
      throw error;
    }
  }

  async reorderExercises(workoutId: string, exerciseIds: string[]) {
    // Atualiza a ordem dos exercícios em uma transação
    return this.prisma.$transaction(
      exerciseIds.map((id, index) =>
        this.prisma.exercise.update({
          where: { id },
          data: { order: index },
        }),
      ),
    );
  }

  async findByMuscleGroup(muscleGroupId: string) {
    this.logger.log({
      message: 'Fetching exercises by muscle group',
      muscleGroupId,
    });

    // Tentar obter do cache
    const cacheKey = `exercises:muscleGroup:${muscleGroupId}`;
    const cachedExercises = await this.cacheManager.get(cacheKey);
    if (cachedExercises) {
      this.logger.log({
        message: 'Returning exercises from cache',
        muscleGroupId,
      });
      return cachedExercises;
    }

    const exercises = await this.prisma.exercise.findMany({
      where: {
        muscleGroups: {
          some: {
            id: muscleGroupId,
          },
        },
      },
      include: {
        equipment: true,
        muscleGroups: true,
      },
    });

    // Salvar no cache
    await this.cacheManager.set(cacheKey, exercises, this.CACHE_TTL);

    return exercises;
  }

  async findByEquipment(equipmentId: string) {
    this.logger.log({
      message: 'Fetching exercises by equipment',
      equipmentId,
    });

    // Tentar obter do cache
    const cacheKey = `exercises:equipment:${equipmentId}`;
    const cachedExercises = await this.cacheManager.get(cacheKey);
    if (cachedExercises) {
      this.logger.log({
        message: 'Returning exercises from cache',
        equipmentId,
      });
      return cachedExercises;
    }

    const exercises = await this.prisma.exercise.findMany({
      where: {
        equipment: {
          some: {
            id: equipmentId,
          },
        },
      },
      include: {
        equipment: true,
        muscleGroups: true,
      },
    });

    // Salvar no cache
    await this.cacheManager.set(cacheKey, exercises, this.CACHE_TTL);

    return exercises;
  }

  private async invalidateCache(id?: string) {
    if (id) {
      await this.cacheManager.del(`${this.CACHE_PREFIX}${id}`);
    }
    await this.cacheManager.del('exercises:all');

    // Limpar cache de relacionamentos
    const keys = await this.cacheManager.store.keys('exercises:*');
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
  }
}
