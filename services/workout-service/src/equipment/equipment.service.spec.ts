import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentService } from './equipment.service';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Prisma } from '@prisma/client';

describe('EquipmentService', () => {
  let service: EquipmentService;
  let prismaService: PrismaService;
  let metricsService: MetricsService;
  let logger: Logger;

  const mockEquipment = {
    id: 1,
    name: 'Test Equipment',
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
    equipment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockMetricsService = {
    startEquipmentOperation: jest.fn(),
    endEquipmentOperation: jest.fn(),
    incrementEquipmentOperation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EquipmentService,
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

    service = module.get<EquipmentService>(EquipmentService);
    prismaService = module.get<PrismaService>(PrismaService);
    metricsService = module.get<MetricsService>(MetricsService);
    logger = module.get(Logger);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateEquipmentDto = {
      name: 'Test Equipment',
      description: 'Test Description',
    };

    beforeEach(() => {
      mockMetricsService.startEquipmentOperation.mockReturnValue(Date.now());
      mockPrismaService.equipment.create.mockResolvedValue(mockEquipment);
    });

    it('should successfully create equipment and track metrics', async () => {
      const result = await service.create(createDto);

      expect(result).toEqual(mockEquipment);
      expect(mockMetricsService.startEquipmentOperation).toHaveBeenCalledWith('create');
      expect(mockMetricsService.incrementEquipmentOperation).toHaveBeenCalledWith('create', 'success');
      expect(mockMetricsService.endEquipmentOperation).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith(`Creating equipment: ${JSON.stringify(createDto)}`);
      expect(logger.log).toHaveBeenCalledWith(`Equipment created successfully: ${mockEquipment.id}`);
    });

    it('should throw ConflictException when equipment name already exists', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2002',
        clientVersion: '2.0.0',
      });
      mockPrismaService.equipment.create.mockRejectedValue(prismaError);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(mockMetricsService.incrementEquipmentOperation).toHaveBeenCalledWith('create', 'error');
      expect(logger.error).toHaveBeenCalledWith(`Equipment name already exists: ${createDto.name}`);
    });
  });

  describe('findAll', () => {
    it('should return all equipment and track metrics', async () => {
      const mockEquipmentList = [mockEquipment];
      mockMetricsService.startEquipmentOperation.mockReturnValue(Date.now());
      mockPrismaService.equipment.findMany.mockResolvedValue(mockEquipmentList);

      const result = await service.findAll();

      expect(result).toEqual(mockEquipmentList);
      expect(mockMetricsService.startEquipmentOperation).toHaveBeenCalledWith('read');
      expect(mockMetricsService.incrementEquipmentOperation).toHaveBeenCalledWith('read', 'success');
      expect(mockMetricsService.endEquipmentOperation).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith('Fetching all equipment');
      expect(logger.log).toHaveBeenCalledWith(`Found ${mockEquipmentList.length} equipment items`);
    });

    it('should handle errors and track metrics', async () => {
      const error = new Error('Database error');
      mockPrismaService.equipment.findMany.mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow(error);
      expect(mockMetricsService.incrementEquipmentOperation).toHaveBeenCalledWith('read', 'error');
    });
  });

  describe('findOne', () => {
    it('should return equipment by id and track metrics', async () => {
      mockMetricsService.startEquipmentOperation.mockReturnValue(Date.now());
      mockPrismaService.equipment.findUnique.mockResolvedValue(mockEquipment);

      const result = await service.findOne(1);

      expect(result).toEqual(mockEquipment);
      expect(mockMetricsService.startEquipmentOperation).toHaveBeenCalledWith('read');
      expect(mockMetricsService.incrementEquipmentOperation).toHaveBeenCalledWith('read', 'success');
      expect(mockMetricsService.endEquipmentOperation).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith('Fetching equipment with id: 1');
    });

    it('should throw NotFoundException when equipment not found', async () => {
      mockPrismaService.equipment.findUnique.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(mockMetricsService.incrementEquipmentOperation).toHaveBeenCalledWith('read', 'error');
      expect(logger.error).toHaveBeenCalledWith('Equipment not found with id: 1');
    });
  });

  describe('update', () => {
    const updateDto: UpdateEquipmentDto = {
      name: 'Updated Equipment',
    };

    beforeEach(() => {
      mockMetricsService.startEquipmentOperation.mockReturnValue(Date.now());
      mockPrismaService.equipment.update.mockResolvedValue({ ...mockEquipment, ...updateDto });
    });

    it('should successfully update equipment and track metrics', async () => {
      const result = await service.update(1, updateDto);

      expect(result).toEqual({ ...mockEquipment, ...updateDto });
      expect(mockMetricsService.startEquipmentOperation).toHaveBeenCalledWith('update');
      expect(mockMetricsService.incrementEquipmentOperation).toHaveBeenCalledWith('update', 'success');
      expect(mockMetricsService.endEquipmentOperation).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith(`Updating equipment 1: ${JSON.stringify(updateDto)}`);
      expect(logger.log).toHaveBeenCalledWith('Equipment updated successfully: 1');
    });

    it('should throw NotFoundException when equipment not found', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '2.0.0',
      });
      mockPrismaService.equipment.update.mockRejectedValue(prismaError);

      await expect(service.update(1, updateDto)).rejects.toThrow(NotFoundException);
      expect(mockMetricsService.incrementEquipmentOperation).toHaveBeenCalledWith('update', 'error');
      expect(logger.error).toHaveBeenCalledWith('Equipment not found with id: 1');
    });

    it('should throw ConflictException when updated name already exists', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2002',
        clientVersion: '2.0.0',
      });
      mockPrismaService.equipment.update.mockRejectedValue(prismaError);

      await expect(service.update(1, updateDto)).rejects.toThrow(ConflictException);
      expect(mockMetricsService.incrementEquipmentOperation).toHaveBeenCalledWith('update', 'error');
      expect(logger.error).toHaveBeenCalledWith(`Equipment name already exists: ${updateDto.name}`);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      mockMetricsService.startEquipmentOperation.mockReturnValue(Date.now());
      mockPrismaService.equipment.delete.mockResolvedValue(mockEquipment);
    });

    it('should successfully remove equipment and track metrics', async () => {
      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
      expect(mockMetricsService.startEquipmentOperation).toHaveBeenCalledWith('delete');
      expect(mockMetricsService.incrementEquipmentOperation).toHaveBeenCalledWith('delete', 'success');
      expect(mockMetricsService.endEquipmentOperation).toHaveBeenCalled();
      expect(logger.log).toHaveBeenCalledWith('Removing equipment with id: 1');
      expect(logger.log).toHaveBeenCalledWith('Equipment removed successfully: 1');
    });

    it('should throw NotFoundException when equipment not found', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: 'P2025',
        clientVersion: '2.0.0',
      });
      mockPrismaService.equipment.delete.mockRejectedValue(prismaError);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(mockMetricsService.incrementEquipmentOperation).toHaveBeenCalledWith('delete', 'error');
      expect(logger.error).toHaveBeenCalledWith('Equipment not found with id: 1');
    });
  });
});
