import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional, IsNumber, Min, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum CompletionStatus {
  COMPLETO = 'completo',
  PARCIAL = 'parcial',
  ADAPTADO = 'adaptado'
}

class ExerciseProgressDto {
  @ApiProperty({
    description: 'ID do exercício',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do exercício deve ser uma string' })
  @IsNotEmpty({ message: 'ID do exercício é obrigatório' })
  exerciseId: string;

  @ApiProperty({
    description: 'Séries completadas',
    example: 3
  })
  @IsNumber({}, { message: 'Séries completadas deve ser um número' })
  @Min(0, { message: 'Séries completadas não pode ser negativo' })
  completedSets: number;

  @ApiProperty({
    description: 'Repetições por série',
    example: [12, 10, 8]
  })
  @IsArray({ message: 'Repetições deve ser um array' })
  @IsNumber({}, { each: true, message: 'Repetições devem ser números' })
  repsPerSet: number[];

  @ApiProperty({
    description: 'Carga utilizada por série (kg)',
    example: [20, 20, 15]
  })
  @IsArray({ message: 'Cargas deve ser um array' })
  @IsNumber({}, { each: true, message: 'Cargas devem ser números' })
  weightPerSet: number[];

  @ApiProperty({
    description: 'Observações sobre o exercício',
    example: 'Diminuiu carga na última série por fadiga',
    required: false
  })
  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  notes?: string;
}

export class CreateWorkoutProgressDto {
  @ApiProperty({
    description: 'ID do treino',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do treino deve ser uma string' })
  @IsNotEmpty({ message: 'ID do treino é obrigatório' })
  workoutId: string;

  @ApiProperty({
    description: 'ID do aluno',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do aluno deve ser uma string' })
  @IsNotEmpty({ message: 'ID do aluno é obrigatório' })
  studentId: string;

  @ApiProperty({
    description: 'Data e hora de início',
    example: '2024-01-20T10:00:00Z'
  })
  @IsDate({ message: 'Data de início inválida' })
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({
    description: 'Data e hora de término',
    example: '2024-01-20T11:00:00Z'
  })
  @IsDate({ message: 'Data de término inválida' })
  @Type(() => Date)
  endTime: Date;

  @ApiProperty({
    description: 'Status de conclusão',
    enum: CompletionStatus,
    example: CompletionStatus.COMPLETO
  })
  @IsEnum(CompletionStatus, { message: 'Status de conclusão inválido' })
  status: CompletionStatus;

  @ApiProperty({
    description: 'Progresso dos exercícios',
    type: [ExerciseProgressDto]
  })
  @ValidateNested({ each: true })
  @Type(() => ExerciseProgressDto)
  @IsArray({ message: 'Progresso dos exercícios deve ser um array' })
  @IsNotEmpty({ message: 'Progresso dos exercícios é obrigatório' })
  exercises: ExerciseProgressDto[];

  @ApiProperty({
    description: 'Calorias estimadas gastas',
    example: 300,
    required: false
  })
  @IsNumber({}, { message: 'Calorias deve ser um número' })
  @Min(0, { message: 'Calorias não pode ser negativo' })
  @IsOptional()
  caloriesBurned?: number;

  @ApiProperty({
    description: 'Nível de esforço percebido (1-10)',
    example: 8,
    required: false
  })
  @IsNumber({}, { message: 'Nível de esforço deve ser um número' })
  @Min(1, { message: 'Nível de esforço deve ser entre 1 e 10' })
  @IsOptional()
  perceivedEffort?: number;

  @ApiProperty({
    description: 'Observações gerais',
    example: 'Treino intenso, boa disposição',
    required: false
  })
  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  notes?: string;
} 