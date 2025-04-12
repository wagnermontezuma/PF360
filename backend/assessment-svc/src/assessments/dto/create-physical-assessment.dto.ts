import { IsString, IsNotEmpty, IsNumber, IsEnum, IsDate, IsOptional, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum PhysicalActivityLevel {
  SEDENTARIO = 'sedentario',
  POUCO_ATIVO = 'pouco_ativo',
  ATIVO = 'ativo',
  MUITO_ATIVO = 'muito_ativo'
}

class AnthropometricMeasuresDto {
  @ApiProperty({
    description: 'Peso em kg',
    example: 75.5,
    minimum: 30,
    maximum: 300
  })
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Peso deve ser um número com até 1 casa decimal' })
  @Min(30, { message: 'Peso mínimo é 30 kg' })
  @Max(300, { message: 'Peso máximo é 300 kg' })
  weight: number;

  @ApiProperty({
    description: 'Altura em cm',
    example: 175,
    minimum: 100,
    maximum: 250
  })
  @IsNumber({}, { message: 'Altura deve ser um número' })
  @Min(100, { message: 'Altura mínima é 100 cm' })
  @Max(250, { message: 'Altura máxima é 250 cm' })
  height: number;

  @ApiProperty({
    description: 'Percentual de gordura corporal',
    example: 20.5,
    minimum: 3,
    maximum: 50
  })
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Percentual de gordura deve ser um número com até 1 casa decimal' })
  @Min(3, { message: 'Percentual mínimo de gordura é 3%' })
  @Max(50, { message: 'Percentual máximo de gordura é 50%' })
  bodyFat: number;

  @ApiProperty({
    description: 'Circunferência da cintura em cm',
    example: 82,
    minimum: 40,
    maximum: 200
  })
  @IsNumber({}, { message: 'Circunferência da cintura deve ser um número' })
  @Min(40, { message: 'Circunferência mínima da cintura é 40 cm' })
  @Max(200, { message: 'Circunferência máxima da cintura é 200 cm' })
  waistCircumference: number;

  @ApiProperty({
    description: 'Massa muscular em kg',
    example: 35.2,
    minimum: 20,
    maximum: 120
  })
  @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Massa muscular deve ser um número com até 1 casa decimal' })
  @Min(20, { message: 'Massa muscular mínima é 20 kg' })
  @Max(120, { message: 'Massa muscular máxima é 120 kg' })
  muscleMass: number;
}

class FitnessTestsDto {
  @ApiProperty({
    description: 'Resultado do teste de flexibilidade (cm)',
    example: 25,
    minimum: -20,
    maximum: 50
  })
  @IsNumber({}, { message: 'Flexibilidade deve ser um número' })
  @Min(-20, { message: 'Flexibilidade mínima é -20 cm' })
  @Max(50, { message: 'Flexibilidade máxima é 50 cm' })
  flexibility: number;

  @ApiProperty({
    description: 'Resultado do teste de força de preensão manual (kg)',
    example: 40,
    minimum: 10,
    maximum: 100
  })
  @IsNumber({}, { message: 'Força de preensão deve ser um número' })
  @Min(10, { message: 'Força mínima de preensão é 10 kg' })
  @Max(100, { message: 'Força máxima de preensão é 100 kg' })
  gripStrength: number;

  @ApiProperty({
    description: 'VO2 máximo estimado (ml/kg/min)',
    example: 35,
    minimum: 15,
    maximum: 80
  })
  @IsNumber({}, { message: 'VO2 máximo deve ser um número' })
  @Min(15, { message: 'VO2 máximo mínimo é 15 ml/kg/min' })
  @Max(80, { message: 'VO2 máximo máximo é 80 ml/kg/min' })
  vo2Max: number;

  @ApiProperty({
    description: 'Número máximo de flexões',
    example: 20,
    minimum: 0,
    maximum: 100
  })
  @IsNumber({}, { message: 'Número de flexões deve ser um número' })
  @Min(0, { message: 'Mínimo de flexões é 0' })
  @Max(100, { message: 'Máximo de flexões é 100' })
  pushUps: number;
}

export class CreatePhysicalAssessmentDto {
  @ApiProperty({
    description: 'ID do aluno',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do aluno deve ser uma string' })
  @IsNotEmpty({ message: 'ID do aluno é obrigatório' })
  studentId: string;

  @ApiProperty({
    description: 'Data da avaliação',
    example: '2024-03-15T10:00:00Z'
  })
  @Type(() => Date)
  @IsDate({ message: 'Data da avaliação inválida' })
  @IsNotEmpty({ message: 'Data da avaliação é obrigatória' })
  assessmentDate: Date;

  @ApiProperty({
    description: 'Nível de atividade física',
    enum: PhysicalActivityLevel,
    example: PhysicalActivityLevel.ATIVO
  })
  @IsEnum(PhysicalActivityLevel, { message: 'Nível de atividade física inválido' })
  activityLevel: PhysicalActivityLevel;

  @ApiProperty({
    description: 'Medidas antropométricas',
    type: AnthropometricMeasuresDto
  })
  @ValidateNested()
  @Type(() => AnthropometricMeasuresDto)
  anthropometricMeasures: AnthropometricMeasuresDto;

  @ApiProperty({
    description: 'Testes físicos',
    type: FitnessTestsDto
  })
  @ValidateNested()
  @Type(() => FitnessTestsDto)
  fitnessTests: FitnessTestsDto;

  @ApiProperty({
    description: 'Observações gerais',
    example: 'Aluno apresentou boa disposição durante os testes',
    required: false
  })
  @IsString({ message: 'Observações deve ser uma string' })
  @IsOptional()
  notes?: string;
} 