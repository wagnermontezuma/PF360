import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CorosService } from './coros.service';

@Module({
  imports: [ConfigModule],
  providers: [CorosService],
  exports: [CorosService],
})
export class CorosModule {} 