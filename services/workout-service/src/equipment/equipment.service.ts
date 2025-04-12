import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class EquipmentService {
  private readonly logger = new Logger(EquipmentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  async create(createEquipmentDto: CreateEquipmentDto) {
    const startTime = this.metrics.startEquipmentOperation('create');
    try {
      this.logger.log(`Creating equipment: ${JSON.stringify(createEquipmentDto)}`);
      const equipment = await this.prisma.equipment.create({
        data: createEquipmentDto,
      });
      this.metrics.incrementEquipmentOperation('create', 'success');
      this.logger.log(`Equipment created successfully: ${equipment.id}`);
      return equipment;
    } catch (error) {
      this.metrics.incrementEquipmentOperation('create', 'error');
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        this.logger.error(`Equipment name already exists: ${createEquipmentDto.name}`);
        throw new ConflictException('Equipment name already exists');
      }
      throw error;
    } finally {
      this.metrics.endEquipmentOperation('create', startTime);
    }
  }

  async findAll() {
    const startTime = this.metrics.startEquipmentOperation('read');
    try {
      this.logger.log('Fetching all equipment');
      const equipment = await this.prisma.equipment.findMany();
      this.metrics.incrementEquipmentOperation('read', 'success');
      this.logger.log(`Found ${equipment.length} equipment items`);
      return equipment;
    } catch (error) {
      this.metrics.incrementEquipmentOperation('read', 'error');
      throw error;
    } finally {
      this.metrics.endEquipmentOperation('read', startTime);
    }
  }

  async findOne(id: number) {
    const startTime = this.metrics.startEquipmentOperation('read');
    try {
      this.logger.log(`Fetching equipment with id: ${id}`);
      const equipment = await this.prisma.equipment.findUnique({
        where: { id },
      });

      if (!equipment) {
        this.metrics.incrementEquipmentOperation('read', 'error');
        this.logger.error(`Equipment not found with id: ${id}`);
        throw new NotFoundException(`Equipment with ID ${id} not found`);
      }

      this.metrics.incrementEquipmentOperation('read', 'success');
      return equipment;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.metrics.incrementEquipmentOperation('read', 'error');
      }
      throw error;
    } finally {
      this.metrics.endEquipmentOperation('read', startTime);
    }
  }

  async update(id: number, updateEquipmentDto: UpdateEquipmentDto) {
    const startTime = this.metrics.startEquipmentOperation('update');
    try {
      this.logger.log(`Updating equipment ${id}: ${JSON.stringify(updateEquipmentDto)}`);
      const equipment = await this.prisma.equipment.update({
        where: { id },
        data: updateEquipmentDto,
      });
      this.metrics.incrementEquipmentOperation('update', 'success');
      this.logger.log(`Equipment updated successfully: ${id}`);
      return equipment;
    } catch (error) {
      this.metrics.incrementEquipmentOperation('update', 'error');
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          this.logger.error(`Equipment not found with id: ${id}`);
          throw new NotFoundException(`Equipment with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          this.logger.error(`Equipment name already exists: ${updateEquipmentDto.name}`);
          throw new ConflictException('Equipment name already exists');
        }
      }
      throw error;
    } finally {
      this.metrics.endEquipmentOperation('update', startTime);
    }
  }

  async remove(id: number) {
    const startTime = this.metrics.startEquipmentOperation('delete');
    try {
      this.logger.log(`Removing equipment with id: ${id}`);
      await this.prisma.equipment.delete({
        where: { id },
      });
      this.metrics.incrementEquipmentOperation('delete', 'success');
      this.logger.log(`Equipment removed successfully: ${id}`);
      return { id };
    } catch (error) {
      this.metrics.incrementEquipmentOperation('delete', 'error');
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        this.logger.error(`Equipment not found with id: ${id}`);
        throw new NotFoundException(`Equipment with ID ${id} not found`);
      }
      throw error;
    } finally {
      this.metrics.endEquipmentOperation('delete', startTime);
    }
  }
}
