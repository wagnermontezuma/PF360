import { PartialType } from '@nestjs/swagger';
import { CreateWorkoutProgressDto } from './create-workout-progress.dto';

export class UpdateWorkoutProgressDto extends PartialType(CreateWorkoutProgressDto) {} 