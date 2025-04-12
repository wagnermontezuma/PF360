import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthKitService } from './healthkit.service';

@Module({
  imports: [ConfigModule],
  providers: [HealthKitService],
  exports: [HealthKitService],
})
export class HealthKitModule {} 