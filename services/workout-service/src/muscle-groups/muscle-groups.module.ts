import { Module } from '@nestjs/common';
import { MuscleGroupsService } from './muscle-groups.service';
import { MuscleGroupsController } from './muscle-groups.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MetricsModule } from '../metrics/metrics.module';

@Module({
  imports: [PrismaModule, MetricsModule],
  controllers: [MuscleGroupsController],
  providers: [MuscleGroupsService],
  exports: [MuscleGroupsService],
})
export class MuscleGroupsModule {}
