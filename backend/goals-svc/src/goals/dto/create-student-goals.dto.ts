import { IsString, IsNotEmpty, IsNumber, IsEnum, IsDate, IsOptional, Min, Max, ValidateNested, ArrayMinSize, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum GoalType {
  EMAGRECIMENTO = 'emagrecimento',
  HIPERTROFIA = 'hipertrofia',
  CONDICIONAMENTO = 'condicionamento',
  FORCA = 'forca',
  REABILITACAO = 'reabilitacao'
}

enum GoalPriority {
  BAIXA = 'baixa',
  MEDIA = 'media',
  ALTA = 'alta'
}

class PhysicalGoalDto {
  @ApiProperty({
    description: 'Peso alvo em kg',
    example: 70.5,
    required: false
  })
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Peso alvo deve ser um número com até 1 casa decimal' })
  @Min(30, { message: 'Peso alvo mínimo é 30 kg' })
  @Max(300, { message: 'Peso alvo máximo é 300 kg' })
  @IsOptional()
  targetWeight?: number;

  @ApiProperty({
    description: 'Percentual de gordura alvo',
    example: 15.5,
    required: false
  })
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Percentual de gordura alvo deve ser um número com até 1 casa decimal' })
  @Min(3, { message: 'Percentual mínimo de gordura alvo é 3%' })
  @Max(50, { message: 'Percentual máximo de gordura alvo é 50%' })
  @IsOptional()
  targetBodyFat?: number;

  @ApiProperty({
    description: 'Massa muscular alvo em kg',
    example: 40.5,
    required: false
  })
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Massa muscular alvo deve ser um número com até 1 casa decimal' })
  @Min(20, { message: 'Massa muscular alvo mínima é 20 kg' })
  @Max(120, { message: 'Massa muscular alvo máxima é 120 kg' })
  @IsOptional()
  targetMuscleMass?: number;
}

class TrainingGoalDto {
  @ApiProperty({
    description: 'Frequência semanal alvo de treinos',
    example: 4,
    minimum: 1,
    maximum: 7
  })
  @IsNumber({}, { message: 'Frequência semanal deve ser um número' })
  @Min(1, { message: 'Frequência semanal mínima é 1' })
  @Max(7, { message: 'Frequência semanal máxima é 7' })
  weeklyFrequency: number;

  @ApiProperty({
    description: 'Duração média alvo dos treinos em minutos',
    example: 60,
    minimum: 15,
    maximum: 180
  })
  @IsNumber({}, { message: 'Duração média deve ser um número' })
  @Min(15, { message: 'Duração média mínima é 15 minutos' })
  @Max(180, { message: 'Duração média máxima é 180 minutos' })
  averageSessionDuration: number;

  @ApiProperty({
    description: 'Intensidade alvo dos treinos (1-10)',
    example: 7,
    minimum: 1,
    maximum: 10
  })
  @IsNumber({}, { message: 'Intensidade deve ser um número' })
  @Min(1, { message: 'Intensidade mínima é 1' })
  @Max(10, { message: 'Intensidade máxima é 10' })
  targetIntensity: number;
}

export class CreateStudentGoalsDto {
  @ApiProperty({
    description: 'ID do aluno',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do aluno deve ser uma string' })
  @IsNotEmpty({ message: 'ID do aluno é obrigatório' })
  studentId: string;

  @ApiProperty({
    description: 'Tipos principais de objetivo',
    type: [String],
    enum: GoalType,
    example: [GoalType.HIPERTROFIA, GoalType.CONDICIONAMENTO]
  })
  @IsArray({ message: 'Tipos de objetivo deve ser um array' })
  @ArrayMinSize(1, { message: 'Selecione pelo menos um tipo de objetivo' })
  @IsEnum(GoalType, { each: true, message: 'Tipo de objetivo inválido' })
  goalTypes: GoalType[];

  @ApiProperty({
    description: 'Prioridade do objetivo',
    enum: GoalPriority,
    example: GoalPriority.ALTA
  })
  @IsEnum(GoalPriority, { message: 'Prioridade inválida' })
  priority: GoalPriority;

  @ApiProperty({
    description: 'Data alvo para atingir os objetivos',
    example: '2024-12-31T23:59:59Z'
  })
  @Type(() => Date)
  @IsDate({ message: 'Data alvo inválida' })
  @IsNotEmpty({ message: 'Data alvo é obrigatória' })
  targetDate: Date;

  @ApiProperty({
    description: 'Objetivos físicos',
    type: PhysicalGoalDto
  })
  @ValidateNested()
  @Type(() => PhysicalGoalDto)
  physicalGoals: PhysicalGoalDto;

  @ApiProperty({
    description: 'Objetivos de treino',
    type: TrainingGoalDto
  })
  @ValidateNested()
  @Type(() => TrainingGoalDto)
  trainingGoals: TrainingGoalDto;

  @ApiProperty({
    description: 'Observações adicionais',
    example: 'Foco em exercícios com peso corporal inicialmente',
    required: false
  })
  @IsString({ message: 'Observações deve ser uma string' })
  @IsOptional()
  notes?: string;
} 