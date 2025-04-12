import { Test, TestingModule } from '@nestjs/testing';
import { ExercisesService } from './exercises.service';
import { PrismaService } from '../prisma/prisma.service';
import { Logger, NotFoundException, CACHE_MANAGER } from '@nestjs/common';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

describe('ExercisesService', () => {
  let service: ExercisesService;
  let prisma: PrismaService;
  let cacheManager: any;

  const mockPrismaService = {
    exercise: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    store: {
      keys: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExercisesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<ExercisesService>(ExercisesService);
    prisma = module.get<PrismaService>(PrismaService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockExercise = {
    id: '1',
    name: 'Supino Reto',
    description: 'Exercício para peitoral',
    instructions: 'Deite no banco e empurre a barra',
    videoUrl: 'https://example.com/video',
    equipment: [{ id: '1', name: 'Barra' }],
    muscleGroups: [{ id: '1', name: 'Peitoral' }],
  };

  const mockCreateDto: CreateExerciseDto = {
    name: 'Supino Reto',
    description: 'Exercício para peitoral',
    instructions: 'Deite no banco e empurre a barra',
    videoUrl: 'https://example.com/video',
    equipmentIds: ['1'],
    muscleGroupIds: ['1'],
  };

  describe('create', () => {
    it('deve criar um exercício com sucesso', async () => {
      mockPrismaService.exercise.create.mockResolvedValue(mockExercise);

      const result = await service.create(mockCreateDto);

      expect(result).toEqual(mockExercise);
      expect(prisma.exercise.create).toHaveBeenCalledWith({
        data: {
          name: mockCreateDto.name,
          description: mockCreateDto.description,
          instructions: mockCreateDto.instructions,
          videoUrl: mockCreateDto.videoUrl,
          equipment: {
            connect: mockCreateDto.equipmentIds.map((id) => ({ id })),
          },
          muscleGroups: {
            connect: mockCreateDto.muscleGroupIds.map((id) => ({ id })),
          },
        },
        include: {
          equipment: true,
          muscleGroups: true,
        },
      });
      expect(cacheManager.del).toHaveBeenCalledWith('exercises:all');
    });

    it('deve lançar erro quando nome já existe', async () => {
      const error = new Error('Já existe um exercício com este nome');
      error['code'] = 'P2002';
      mockPrismaService.exercise.create.mockRejectedValue(error);

      await expect(service.create(mockCreateDto)).rejects.toThrow(
        'Já existe um exercício com este nome',
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar exercícios do cache quando disponível', async () => {
      mockCacheManager.get.mockResolvedValue([mockExercise]);

      const result = await service.findAll();

      expect(result).toEqual([mockExercise]);
      expect(cacheManager.get).toHaveBeenCalledWith('exercises:all');
      expect(prisma.exercise.findMany).not.toHaveBeenCalled();
    });

    it('deve buscar exercícios do banco quando cache está vazio', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.exercise.findMany.mockResolvedValue([mockExercise]);

      const result = await service.findAll();

      expect(result).toEqual([mockExercise]);
      expect(cacheManager.get).toHaveBeenCalledWith('exercises:all');
      expect(prisma.exercise.findMany).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith(
        'exercises:all',
        [mockExercise],
        3600,
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar exercício do cache quando disponível', async () => {
      mockCacheManager.get.mockResolvedValue(mockExercise);

      const result = await service.findOne('1');

      expect(result).toEqual(mockExercise);
      expect(cacheManager.get).toHaveBeenCalledWith('exercise:1');
      expect(prisma.exercise.findUnique).not.toHaveBeenCalled();
    });

    it('deve buscar exercício do banco quando cache está vazio', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.exercise.findUnique.mockResolvedValue(mockExercise);

      const result = await service.findOne('1');

      expect(result).toEqual(mockExercise);
      expect(cacheManager.get).toHaveBeenCalledWith('exercise:1');
      expect(prisma.exercise.findUnique).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith(
        'exercise:1',
        mockExercise,
        3600,
      );
    });

    it('deve lançar NotFoundException quando exercício não existe', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.exercise.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const mockUpdateDto: UpdateExerciseDto = {
      name: 'Supino Reto Atualizado',
    };

    it('deve atualizar um exercício com sucesso', async () => {
      const updatedExercise = { ...mockExercise, ...mockUpdateDto };
      mockPrismaService.exercise.update.mockResolvedValue(updatedExercise);

      const result = await service.update('1', mockUpdateDto);

      expect(result).toEqual(updatedExercise);
      expect(prisma.exercise.update).toHaveBeenCalled();
      expect(cacheManager.del).toHaveBeenCalledWith('exercise:1');
      expect(cacheManager.del).toHaveBeenCalledWith('exercises:all');
    });

    it('deve lançar NotFoundException quando exercício não existe', async () => {
      const error = new Error('Not found');
      error['code'] = 'P2025';
      mockPrismaService.exercise.update.mockRejectedValue(error);

      await expect(service.update('1', mockUpdateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve remover um exercício com sucesso', async () => {
      mockPrismaService.exercise.delete.mockResolvedValue(mockExercise);

      const result = await service.remove('1');

      expect(result).toEqual(mockExercise);
      expect(prisma.exercise.delete).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          equipment: true,
          muscleGroups: true,
        },
      });
      expect(cacheManager.del).toHaveBeenCalledWith('exercise:1');
      expect(cacheManager.del).toHaveBeenCalledWith('exercises:all');
    });

    it('deve lançar NotFoundException quando exercício não existe', async () => {
      const error = new Error('Not found');
      error['code'] = 'P2025';
      mockPrismaService.exercise.delete.mockRejectedValue(error);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByMuscleGroup', () => {
    it('deve retornar exercícios do cache quando disponível', async () => {
      mockCacheManager.get.mockResolvedValue([mockExercise]);

      const result = await service.findByMuscleGroup('1');

      expect(result).toEqual([mockExercise]);
      expect(cacheManager.get).toHaveBeenCalledWith('exercises:muscleGroup:1');
      expect(prisma.exercise.findMany).not.toHaveBeenCalled();
    });

    it('deve buscar exercícios do banco quando cache está vazio', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.exercise.findMany.mockResolvedValue([mockExercise]);

      const result = await service.findByMuscleGroup('1');

      expect(result).toEqual([mockExercise]);
      expect(cacheManager.get).toHaveBeenCalledWith('exercises:muscleGroup:1');
      expect(prisma.exercise.findMany).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith(
        'exercises:muscleGroup:1',
        [mockExercise],
        3600,
      );
    });
  });

  describe('findByEquipment', () => {
    it('deve retornar exercícios do cache quando disponível', async () => {
      mockCacheManager.get.mockResolvedValue([mockExercise]);

      const result = await service.findByEquipment('1');

      expect(result).toEqual([mockExercise]);
      expect(cacheManager.get).toHaveBeenCalledWith('exercises:equipment:1');
      expect(prisma.exercise.findMany).not.toHaveBeenCalled();
    });

    it('deve buscar exercícios do banco quando cache está vazio', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.exercise.findMany.mockResolvedValue([mockExercise]);

      const result = await service.findByEquipment('1');

      expect(result).toEqual([mockExercise]);
      expect(cacheManager.get).toHaveBeenCalledWith('exercises:equipment:1');
      expect(prisma.exercise.findMany).toHaveBeenCalled();
      expect(cacheManager.set).toHaveBeenCalledWith(
        'exercises:equipment:1',
        [mockExercise],
        3600,
      );
    });
  });

  describe('reorderExercises', () => {
    it('deve reordenar exercícios com sucesso', async () => {
      const exerciseIds = ['1', '2', '3'];
      const workoutId = '1';

      mockPrismaService.$transaction.mockResolvedValue([mockExercise]);

      await service.reorderExercises(workoutId, exerciseIds);

      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });
});
