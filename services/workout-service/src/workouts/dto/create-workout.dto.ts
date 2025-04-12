import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { WorkoutDifficulty, WorkoutStatus } from '@prisma/client';

export class CreateWorkoutDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  userId: string;

  @IsBoolean()
  @IsOptional()
  isTemplate?: boolean;

  @IsEnum(WorkoutStatus)
  @IsOptional()
  status?: WorkoutStatus;

  @IsEnum(WorkoutDifficulty)
  difficulty: WorkoutDifficulty;

  @IsInt()
  @Min(1)
  @Max(480)
  duration: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  calories?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}
