import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GarminService } from './garmin.service';

@Module({
  imports: [ConfigModule],
  providers: [GarminService],
  exports: [GarminService],
})
export class GarminModule {} 