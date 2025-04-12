import { Test, TestingModule } from '@nestjs/testing';
import { MuscleGroupsService } from './muscle-groups.service';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateMuscleGroupDto } from './dto/create-muscle-group.dto';
import { UpdateMuscleGroupDto } from './dto/update-muscle-group.dto';
import { Prisma } from '@prisma/client';

describe('MuscleGroupsService', () => {
  let service: MuscleGroupsService;
  let prismaService: PrismaService;
  let metricsService: MetricsService;
  let logger: Logger;

  const mockMuscleGroup = {
    id: 1,
    name: 'Test Muscle Group',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };

  const mockPrismaService = {
    muscleGroup: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockMetricsService = {
    startResourceOperation: jest.fn(),
    endResourceOperation: jest.fn(),
    incrementResourceOperation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MuscleGroupsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: MetricsService,
          useValue: mockMetricsService,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<MuscleGroupsService>(MuscleGroupsService);
    prismaService = module.get<PrismaService>(PrismaService);
    metricsService = module.get<MetricsService>(MetricsService);
    logger = module.get(Logger);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateMuscleGroupDto = {
      name: 'Test Muscle Group',
      description: 'Test Description',
    };

    beforeEach(() => {
      mockMetricsService.startResourceOperation.mockReturnValue(Date.now());
      mockPrismaService.muscleGroup.create.mockResolvedValue(mockMuscleGroup);
    });

    it('should successfully create muscle group and track metrics', async () => {
      const result = await service.create(createDto);

      expect(result).toEqual(mockMuscleGroup);
      expect(mockMetricsService.startResourceOperation).toHaveBeenCalledWith('muscle_group', 'create');
      expect(mockMetricsService.incrementResourceOperation).toHaveBeenCalledWith('muscle_group', 'create', 'success');
      expect(mockMetricsService.endResourceOperation).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith(`Creating muscle group: ${JSON.stringify(createDto)}`);
      expect(logger.log).toHaveBeenCalledWith(`Muscle group created successfully: ${mockMuscleGroup.id}`);
    });

    it('should throw ConflictException when muscle group name already exists', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2002',
        clientVersion: '2.0.0',
      });
      mockPrismaService.muscleGroup.create.mockRejectedValue(prismaError);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(mockMetricsService.incrementResourceOperation).toHaveBeenCalledWith('muscle_group', 'create', 'error');
      expect(logger.error).toHaveBeenCalledWith(`Muscle group name already exists: ${createDto.name}`);
    });
  });

  describe('findAll', () => {
    it('should return all muscle groups and track metrics', async () => {
      const mockMuscleGroups = [mockMuscleGroup];
      mockMetricsService.startResourceOperation.mockReturnValue(Date.now());
      mockPrismaService.muscleGroup.findMany.mockResolvedValue(mockMuscleGroups);

      const result = await service.findAll();

      expect(result).toEqual(mockMuscleGroups);
      expect(mockMetricsService.startResourceOperation).toHaveBeenCalledWith('muscle_group', 'read');
      expect(mockMetricsService.incrementResourceOperation).toHaveBeenCalledWith('muscle_group', 'read', 'success');
      expect(mockMetricsService.endResourceOperation).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith('Fetching all muscle groups');
      expect(logger.log).toHaveBeenCalledWith(`Found ${mockMuscleGroups.length} muscle group items`);
    });

    it('should handle errors and track metrics', async () => {
      const error = new Error('Database error');
      mockPrismaService.muscleGroup.findMany.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow(error);
      expect(mockMetricsService.incrementResourceOperation).toHaveBeenCalledWith('muscle_group', 'read', 'error');
    });
  });

  describe('findOne', () => {
    it('should return muscle group by id and track metrics', async () => {
      mockMetricsService.startResourceOperation.mockReturnValue(Date.now());
      mockPrismaService.muscleGroup.findUnique.mockResolvedValue(mockMuscleGroup);

      const result = await service.findOne(1);

      expect(result).toEqual(mockMuscleGroup);
      expect(mockMetricsService.startResourceOperation).toHaveBeenCalledWith('muscle_group', 'read');
      expect(mockMetricsService.incrementResourceOperation).toHaveBeenCalledWith('muscle_group', 'read', 'success');
      expect(mockMetricsService.endResourceOperation).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith('Fetching muscle group with id: 1');
    });

    it('should throw NotFoundException when muscle group not found', async () => {
      mockPrismaService.muscleGroup.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(mockMetricsService.incrementResourceOperation).toHaveBeenCalledWith('muscle_group', 'read', 'error');
      expect(logger.error).toHaveBeenCalledWith('Muscle group not found with id: 1');
    });
  });

  describe('update', () => {
    const updateDto: UpdateMuscleGroupDto = {
      name: 'Updated Muscle Group',
    };

    beforeEach(() => {
      mockMetricsService.startResourceOperation.mockReturnValue(Date.now());
      mockPrismaService.muscleGroup.update.mockResolvedValue({ ...mockMuscleGroup, ...updateDto });
    });

    it('should successfully update muscle group and track metrics', async () => {
      const result = await service.update(1, updateDto);

      expect(result).toEqual({ ...mockMuscleGroup, ...updateDto });
      expect(mockMetricsService.startResourceOperation).toHaveBeenCalledWith('muscle_group', 'update');
      expect(mockMetricsService.incrementResourceOperation).toHaveBeenCalledWith('muscle_group', 'update', 'success');
      expect(mockMetricsService.endResourceOperation).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith(`Updating muscle group 1: ${JSON.stringify(updateDto)}`);
      expect(logger.log).toHaveBeenCalledWith('Muscle group updated successfully: 1');
    });

    it('should throw NotFoundException when muscle group not found', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '2.0.0',
      });
      mockPrismaService.muscleGroup.update.mockRejectedValue(prismaError);

      await expect(service.update(1, updateDto)).rejects.toThrow(NotFoundException);
      expect(mockMetricsService.incrementResourceOperation).toHaveBeenCalledWith('muscle_group', 'update', 'error');
      expect(logger.error).toHaveBeenCalledWith('Muscle group not found with id: 1');
    });

    it('should throw ConflictException when updated name already exists', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2002',
        clientVersion: '2.0.0',
      });
      mockPrismaService.muscleGroup.update.mockRejectedValue(prismaError);

      await expect(service.update(1, updateDto)).rejects.toThrow(ConflictException);
      expect(mockMetricsService.incrementResourceOperation).toHaveBeenCalledWith('muscle_group', 'update', 'error');
      expect(logger.error).toHaveBeenCalledWith(`Muscle group name already exists: ${updateDto.name}`);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      mockMetricsService.startResourceOperation.mockReturnValue(Date.now());
      mockPrismaService.muscleGroup.delete.mockResolvedValue(mockMuscleGroup);
    });

    it('should successfully remove muscle group and track metrics', async () => {
      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
      expect(mockMetricsService.startResourceOperation).toHaveBeenCalledWith('muscle_group', 'delete');
      expect(mockMetricsService.incrementResourceOperation).toHaveBeenCalledWith('muscle_group', 'delete', 'success');
      expect(mockMetricsService.endResourceOperation).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith('Removing muscle group with id: 1');
      expect(logger.log).toHaveBeenCalledWith('Muscle group removed successfully: 1');
    });

    it('should throw NotFoundException when muscle group not found', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '2.0.0',
      });
      mockPrismaService.muscleGroup.delete.mockRejectedValue(prismaError);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(mockMetricsService.incrementResourceOperation).toHaveBeenCalledWith('muscle_group', 'delete', 'error');
      expect(logger.error).toHaveBeenCalledWith('Muscle group not found with id: 1');
    });
  });
});
