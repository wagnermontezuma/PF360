import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NutritionModule } from './nutrition/nutrition.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NutritionModule,
  ],
})
export class AppModule {} 