import { IsString, IsNotEmpty, IsNumber, IsEnum, IsDate, IsOptional, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum ProgressStatus {
  ABAIXO_ESPERADO = 'abaixo_esperado',
  DENTRO_ESPERADO = 'dentro_esperado',
  ACIMA_ESPERADO = 'acima_esperado'
}

class PhysicalProgressDto {
  @ApiProperty({
    description: 'Peso atual em kg',
    example: 75.5
  })
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Peso deve ser um número com até 1 casa decimal' })
  @Min(30, { message: 'Peso mínimo é 30 kg' })
  @Max(300, { message: 'Peso máximo é 300 kg' })
  currentWeight: number;

  @ApiProperty({
    description: 'Percentual atual de gordura corporal',
    example: 18.5
  })
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Percentual de gordura deve ser um número com até 1 casa decimal' })
  @Min(3, { message: 'Percentual mínimo de gordura é 3%' })
  @Max(50, { message: 'Percentual máximo de gordura é 50%' })
  currentBodyFat: number;

  @ApiProperty({
    description: 'Massa muscular atual em kg',
    example: 35.2
  })
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Massa muscular deve ser um número com até 1 casa decimal' })
  @Min(20, { message: 'Massa muscular mínima é 20 kg' })
  @Max(120, { message: 'Massa muscular máxima é 120 kg' })
  currentMuscleMass: number;

  @ApiProperty({
    description: 'Circunferência atual da cintura em cm',
    example: 82
  })
  @IsNumber({}, { message: 'Circunferência da cintura deve ser um número' })
  @Min(40, { message: 'Circunferência mínima da cintura é 40 cm' })
  @Max(200, { message: 'Circunferência máxima da cintura é 200 cm' })
  currentWaistCircumference: number;
}

class TrainingProgressDto {
  @ApiProperty({
    description: 'Treinos realizados na última semana',
    example: 4
  })
  @IsNumber({}, { message: 'Número de treinos deve ser um número' })
  @Min(0, { message: 'Mínimo de treinos é 0' })
  @Max(14, { message: 'Máximo de treinos é 14' })
  weeklyWorkouts: number;

  @ApiProperty({
    description: 'Duração média dos treinos em minutos',
    example: 65
  })
  @IsNumber({}, { message: 'Duração média deve ser um número' })
  @Min(15, { message: 'Duração média mínima é 15 minutos' })
  @Max(180, { message: 'Duração média máxima é 180 minutos' })
  averageSessionDuration: number;

  @ApiProperty({
    description: 'Intensidade média dos treinos (1-10)',
    example: 7
  })
  @IsNumber({}, { message: 'Intensidade média deve ser um número' })
  @Min(1, { message: 'Intensidade mínima é 1' })
  @Max(10, { message: 'Intensidade máxima é 10' })
  averageIntensity: number;

  @ApiProperty({
    description: 'Taxa de conclusão dos treinos (%)',
    example: 85.5
  })
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Taxa de conclusão deve ser um número com até 1 casa decimal' })
  @Min(0, { message: 'Taxa mínima de conclusão é 0%' })
  @Max(100, { message: 'Taxa máxima de conclusão é 100%' })
  completionRate: number;
}

export class CreateStudentProgressDto {
  @ApiProperty({
    description: 'ID do aluno',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do aluno deve ser uma string' })
  @IsNotEmpty({ message: 'ID do aluno é obrigatório' })
  studentId: string;

  @ApiProperty({
    description: 'ID do objetivo relacionado',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do objetivo deve ser uma string' })
  @IsNotEmpty({ message: 'ID do objetivo é obrigatório' })
  goalId: string;

  @ApiProperty({
    description: 'Data da avaliação de progresso',
    example: '2024-03-15T10:00:00Z'
  })
  @Type(() => Date)
  @IsDate({ message: 'Data da avaliação inválida' })
  @IsNotEmpty({ message: 'Data da avaliação é obrigatória' })
  assessmentDate: Date;

  @ApiProperty({
    description: 'Status geral do progresso',
    enum: ProgressStatus,
    example: ProgressStatus.DENTRO_ESPERADO
  })
  @IsEnum(ProgressStatus, { message: 'Status de progresso inválido' })
  status: ProgressStatus;

  @ApiProperty({
    description: 'Progresso físico',
    type: PhysicalProgressDto
  })
  @ValidateNested()
  @Type(() => PhysicalProgressDto)
  physicalProgress: PhysicalProgressDto;

  @ApiProperty({
    description: 'Progresso nos treinos',
    type: TrainingProgressDto
  })
  @ValidateNested()
  @Type(() => TrainingProgressDto)
  trainingProgress: TrainingProgressDto;

  @ApiProperty({
    description: 'Observações sobre o progresso',
    example: 'Aluno demonstra consistência nos treinos e boa adaptação à dieta',
    required: false
  })
  @IsString({ message: 'Observações deve ser uma string' })
  @IsOptional()
  notes?: string;
} 