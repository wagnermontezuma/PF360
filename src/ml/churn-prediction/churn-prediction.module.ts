import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { ChurnPredictionService } from './churn-prediction.service';
import { ChurnPredictionController } from './churn-prediction.controller';
import { ChurnPrediction } from './entities/churn-prediction.entity';

import { StudentModule } from '../students/student.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { TrainingModule } from '../training/training.module';
import { PaymentModule } from '../payment/payment.module';
import { FeedbackModule } from '../feedback/feedback.module';
import { AssessmentModule } from '../assessment/assessment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChurnPrediction]),
    ScheduleModule.forRoot(),
    StudentModule,
    AttendanceModule, 
    TrainingModule,
    PaymentModule,
    FeedbackModule,
    AssessmentModule
  ],
  controllers: [ChurnPredictionController],
  providers: [ChurnPredictionService],
  exports: [ChurnPredictionService]
})
export class ChurnPredictionModule {} 