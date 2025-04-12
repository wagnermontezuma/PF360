import { IsString, IsNotEmpty, IsArray, IsInt, Min, Max, ValidateNested, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CompletedExerciseDto {
  @ApiProperty({
    description: 'ID do exercício',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do exercício deve ser uma string' })
  @IsNotEmpty({ message: 'ID do exercício é obrigatório' })
  exerciseId: string;

  @ApiProperty({
    description: 'Séries completadas',
    example: 3,
    minimum: 0,
    maximum: 10
  })
  @IsInt({ message: 'Séries completadas deve ser um número inteiro' })
  @Min(0, { message: 'Mínimo de séries completadas é 0' })
  @Max(10, { message: 'Máximo de séries completadas é 10' })
  completedSets: number;

  @ApiProperty({
    description: 'Repetições realizadas por série',
    example: [12, 10, 8],
    type: [Number]
  })
  @IsArray({ message: 'Repetições deve ser um array' })
  @IsInt({ each: true, message: 'Cada repetição deve ser um número inteiro' })
  @Min(0, { each: true, message: 'Mínimo de repetições é 0' })
  @Max(100, { each: true, message: 'Máximo de repetições é 100' })
  repsPerSet: number[];

  @ApiProperty({
    description: 'Peso utilizado por série em kg',
    example: [20, 20, 15],
    type: [Number]
  })
  @IsArray({ message: 'Pesos deve ser um array' })
  @IsInt({ each: true, message: 'Cada peso deve ser um número inteiro' })
  @Min(0, { each: true, message: 'Peso mínimo é 0 kg' })
  @Max(500, { each: true, message: 'Peso máximo é 500 kg' })
  weightPerSet: number[];

  @ApiProperty({
    description: 'Nível de dificuldade percebido (1-10)',
    example: 7,
    minimum: 1,
    maximum: 10
  })
  @IsInt({ message: 'Nível de dificuldade deve ser um número inteiro' })
  @Min(1, { message: 'Nível mínimo de dificuldade é 1' })
  @Max(10, { message: 'Nível máximo de dificuldade é 10' })
  perceivedDifficulty: number;
}

export class CompleteWorkoutDto {
  @ApiProperty({
    description: 'ID do treino',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do treino deve ser uma string' })
  @IsNotEmpty({ message: 'ID do treino é obrigatório' })
  workoutId: string;

  @ApiProperty({
    description: 'Data e hora de início do treino',
    example: '2024-03-15T10:00:00Z'
  })
  @Type(() => Date)
  @IsDate({ message: 'Data de início inválida' })
  @IsNotEmpty({ message: 'Data de início é obrigatória' })
  startTime: Date;

  @ApiProperty({
    description: 'Data e hora de término do treino',
    example: '2024-03-15T11:30:00Z'
  })
  @Type(() => Date)
  @IsDate({ message: 'Data de término inválida' })
  @IsNotEmpty({ message: 'Data de término é obrigatória' })
  endTime: Date;

  @ApiProperty({
    description: 'Lista de exercícios completados',
    type: [CompletedExerciseDto]
  })
  @IsArray({ message: 'Exercícios deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => CompletedExerciseDto)
  completedExercises: CompletedExerciseDto[];

  @ApiProperty({
    description: 'Observações sobre o treino',
    example: 'Senti mais disposição hoje, consegui aumentar a carga em alguns exercícios',
    required: false
  })
  @IsString({ message: 'Observações deve ser uma string' })
  @IsOptional()
  notes?: string;
} 