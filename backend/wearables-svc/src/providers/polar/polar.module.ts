import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PolarService } from './polar.service';

@Module({
  imports: [ConfigModule],
  providers: [PolarService],
  exports: [PolarService],
})
export class PolarModule {} 