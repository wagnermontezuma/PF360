import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { CreateMuscleGroupDto } from './dto/create-muscle-group.dto';
import { UpdateMuscleGroupDto } from './dto/update-muscle-group.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class MuscleGroupsService {
  private readonly logger = new Logger(MuscleGroupsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly metrics: MetricsService,
  ) {}

  async create(createMuscleGroupDto: CreateMuscleGroupDto) {
    const startTime = this.metrics.startResourceOperation('muscle_group', 'create');
    try {
      this.logger.log(`Creating muscle group: ${JSON.stringify(createMuscleGroupDto)}`);
      const muscleGroup = await this.prisma.muscleGroup.create({
        data: createMuscleGroupDto,
      });
      this.metrics.incrementResourceOperation('muscle_group', 'create', 'success');
      this.logger.log(`Muscle group created successfully: ${muscleGroup.id}`);
      return muscleGroup;
    } catch (error) {
      this.metrics.incrementResourceOperation('muscle_group', 'create', 'error');
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        this.logger.error(`Muscle group name already exists: ${createMuscleGroupDto.name}`);
        throw new ConflictException('Muscle group name already exists');
      }
      throw error;
    } finally {
      this.metrics.endResourceOperation('muscle_group', 'create', startTime);
    }
  }

  async findAll() {
    const startTime = this.metrics.startResourceOperation('muscle_group', 'read');
    try {
      this.logger.log('Fetching all muscle groups');
      const muscleGroups = await this.prisma.muscleGroup.findMany();
      this.metrics.incrementResourceOperation('muscle_group', 'read', 'success');
      this.logger.log(`Found ${muscleGroups.length} muscle group items`);
      return muscleGroups;
    } catch (error) {
      this.metrics.incrementResourceOperation('muscle_group', 'read', 'error');
      throw error;
    } finally {
      this.metrics.endResourceOperation('muscle_group', 'read', startTime);
    }
  }

  async findOne(id: number) {
    const startTime = this.metrics.startResourceOperation('muscle_group', 'read');
    try {
      this.logger.log(`Fetching muscle group with id: ${id}`);
      const muscleGroup = await this.prisma.muscleGroup.findUnique({
        where: { id },
      });

      if (!muscleGroup) {
        this.metrics.incrementResourceOperation('muscle_group', 'read', 'error');
        this.logger.error(`Muscle group not found with id: ${id}`);
        throw new NotFoundException(`Muscle group with ID ${id} not found`);
      }

      this.metrics.incrementResourceOperation('muscle_group', 'read', 'success');
      return muscleGroup;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.metrics.incrementResourceOperation('muscle_group', 'read', 'error');
      }
      throw error;
    } finally {
      this.metrics.endResourceOperation('muscle_group', 'read', startTime);
    }
  }

  async update(id: number, updateMuscleGroupDto: UpdateMuscleGroupDto) {
    const startTime = this.metrics.startResourceOperation('muscle_group', 'update');
    try {
      this.logger.log(`Updating muscle group ${id}: ${JSON.stringify(updateMuscleGroupDto)}`);
      const muscleGroup = await this.prisma.muscleGroup.update({
        where: { id },
        data: updateMuscleGroupDto,
      });
      this.metrics.incrementResourceOperation('muscle_group', 'update', 'success');
      this.logger.log(`Muscle group updated successfully: ${id}`);
      return muscleGroup;
    } catch (error) {
      this.metrics.incrementResourceOperation('muscle_group', 'update', 'error');
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          this.logger.error(`Muscle group not found with id: ${id}`);
          throw new NotFoundException(`Muscle group with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          this.logger.error(`Muscle group name already exists: ${updateMuscleGroupDto.name}`);
          throw new ConflictException('Muscle group name already exists');
        }
      }
      throw error;
    } finally {
      this.metrics.endResourceOperation('muscle_group', 'update', startTime);
    }
  }

  async remove(id: number) {
    const startTime = this.metrics.startResourceOperation('muscle_group', 'delete');
    try {
      this.logger.log(`Removing muscle group with id: ${id}`);
      await this.prisma.muscleGroup.delete({
        where: { id },
      });
      this.metrics.incrementResourceOperation('muscle_group', 'delete', 'success');
      this.logger.log(`Muscle group removed successfully: ${id}`);
      return { id };
    } catch (error) {
      this.metrics.incrementResourceOperation('muscle_group', 'delete', 'error');
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        this.logger.error(`Muscle group not found with id: ${id}`);
        throw new NotFoundException(`Muscle group with ID ${id} not found`);
      }
      throw error;
    } finally {
      this.metrics.endResourceOperation('muscle_group', 'delete', startTime);
    }
  }
}
