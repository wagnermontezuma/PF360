import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum WorkoutType {
  MUSCULACAO = 'musculacao',
  CARDIO = 'cardio',
  FUNCIONAL = 'funcional',
  HIIT = 'hiit',
  YOGA = 'yoga',
  PILATES = 'pilates'
}

enum WorkoutLevel {
  INICIANTE = 'iniciante',
  INTERMEDIARIO = 'intermediario',
  AVANCADO = 'avancado'
}

class WorkoutExerciseDto {
  @ApiProperty({
    description: 'ID do exercício',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do exercício deve ser uma string' })
  @IsNotEmpty({ message: 'ID do exercício é obrigatório' })
  exerciseId: string;

  @ApiProperty({
    description: 'Número de séries',
    example: 3
  })
  @IsNumber({}, { message: 'Número de séries deve ser um número' })
  @Min(1, { message: 'Número de séries deve ser maior que 0' })
  sets: number;

  @ApiProperty({
    description: 'Número de repetições por série',
    example: 12
  })
  @IsNumber({}, { message: 'Número de repetições deve ser um número' })
  @Min(1, { message: 'Número de repetições deve ser maior que 0' })
  reps: number;

  @ApiProperty({
    description: 'Tempo de descanso entre séries (segundos)',
    example: 60
  })
  @IsNumber({}, { message: 'Tempo de descanso deve ser um número' })
  @Min(0, { message: 'Tempo de descanso não pode ser negativo' })
  restTime: number;

  @ApiProperty({
    description: 'Instruções específicas',
    example: 'Manter ritmo controlado',
    required: false
  })
  @IsString({ message: 'Instruções devem ser uma string' })
  @IsOptional()
  instructions?: string;
}

export class CreateWorkoutDto {
  @ApiProperty({
    description: 'Nome do treino',
    example: 'Treino A - Superior'
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Descrição do treino',
    example: 'Treino focado em membros superiores'
  })
  @IsString({ message: 'Descrição deve ser uma string' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  description: string;

  @ApiProperty({
    description: 'Tipo do treino',
    enum: WorkoutType,
    example: WorkoutType.MUSCULACAO
  })
  @IsEnum(WorkoutType, { message: 'Tipo de treino inválido' })
  type: WorkoutType;

  @ApiProperty({
    description: 'Nível do treino',
    enum: WorkoutLevel,
    example: WorkoutLevel.INTERMEDIARIO
  })
  @IsEnum(WorkoutLevel, { message: 'Nível de treino inválido' })
  level: WorkoutLevel;

  @ApiProperty({
    description: 'ID do aluno',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do aluno deve ser uma string' })
  @IsNotEmpty({ message: 'ID do aluno é obrigatório' })
  studentId: string;

  @ApiProperty({
    description: 'ID do instrutor',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do instrutor deve ser uma string' })
  @IsNotEmpty({ message: 'ID do instrutor é obrigatório' })
  instructorId: string;

  @ApiProperty({
    description: 'Exercícios do treino',
    type: [WorkoutExerciseDto]
  })
  @ValidateNested({ each: true })
  @Type(() => WorkoutExerciseDto)
  @IsArray({ message: 'Exercícios devem ser um array' })
  @IsNotEmpty({ message: 'Exercícios são obrigatórios' })
  exercises: WorkoutExerciseDto[];

  @ApiProperty({
    description: 'Duração estimada (minutos)',
    example: 60
  })
  @IsNumber({}, { message: 'Duração deve ser um número' })
  @Min(1, { message: 'Duração deve ser maior que 0' })
  estimatedDuration: number;

  @ApiProperty({
    description: 'Observações gerais',
    example: 'Realizar aquecimento antes de iniciar',
    required: false
  })
  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Tags para categorização',
    example: ['hipertrofia', 'força', 'superior'],
    required: false
  })
  @IsArray({ message: 'Tags devem ser um array' })
  @IsString({ each: true, message: 'Tags devem ser strings' })
  @IsOptional()
  tags?: string[];
} 