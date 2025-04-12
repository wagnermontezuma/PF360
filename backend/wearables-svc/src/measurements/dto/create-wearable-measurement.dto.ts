import { IsString, IsNotEmpty, IsEnum, IsNumber, Min, Max, ValidateNested, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum WearableType {
  SMARTWATCH = 'smartwatch',
  FITNESS_TRACKER = 'fitness_tracker',
  HEART_RATE_MONITOR = 'heart_rate_monitor',
  SMART_CLOTHING = 'smart_clothing'
}

enum DataSource {
  GARMIN = 'garmin',
  FITBIT = 'fitbit',
  APPLE_HEALTH = 'apple_health',
  GOOGLE_FIT = 'google_fit',
  POLAR = 'polar',
  SUUNTO = 'suunto'
}

class HeartRateDataDto {
  @ApiProperty({
    description: 'Frequência cardíaca média (bpm)',
    example: 75
  })
  @IsNumber({}, { message: 'Frequência cardíaca média deve ser um número' })
  @Min(20, { message: 'Frequência cardíaca mínima é 20bpm' })
  @Max(250, { message: 'Frequência cardíaca máxima é 250bpm' })
  average: number;

  @ApiProperty({
    description: 'Frequência cardíaca máxima (bpm)',
    example: 165
  })
  @IsNumber({}, { message: 'Frequência cardíaca máxima deve ser um número' })
  @Min(20, { message: 'Frequência cardíaca mínima é 20bpm' })
  @Max(250, { message: 'Frequência cardíaca máxima é 250bpm' })
  max: number;

  @ApiProperty({
    description: 'Frequência cardíaca mínima (bpm)',
    example: 45
  })
  @IsNumber({}, { message: 'Frequência cardíaca mínima deve ser um número' })
  @Min(20, { message: 'Frequência cardíaca mínima é 20bpm' })
  @Max(250, { message: 'Frequência cardíaca máxima é 250bpm' })
  min: number;

  @ApiProperty({
    description: 'Zonas de frequência cardíaca (minutos)',
    example: {
      'zona1': 30,
      'zona2': 45,
      'zona3': 15
    },
    required: false
  })
  @IsOptional()
  zones?: Record<string, number>;
}

class ActivityDataDto {
  @ApiProperty({
    description: 'Passos',
    example: 10000
  })
  @IsNumber({}, { message: 'Número de passos deve ser um número' })
  @Min(0, { message: 'Número de passos não pode ser negativo' })
  steps: number;

  @ApiProperty({
    description: 'Distância (metros)',
    example: 8500
  })
  @IsNumber({}, { message: 'Distância deve ser um número' })
  @Min(0, { message: 'Distância não pode ser negativa' })
  distance: number;

  @ApiProperty({
    description: 'Calorias ativas (kcal)',
    example: 450
  })
  @IsNumber({}, { message: 'Calorias ativas deve ser um número' })
  @Min(0, { message: 'Calorias ativas não pode ser negativo' })
  activeCalories: number;

  @ApiProperty({
    description: 'Minutos de atividade',
    example: 90
  })
  @IsNumber({}, { message: 'Minutos de atividade deve ser um número' })
  @Min(0, { message: 'Minutos de atividade não pode ser negativo' })
  activeMinutes: number;
}

class SleepDataDto {
  @ApiProperty({
    description: 'Duração total (minutos)',
    example: 480
  })
  @IsNumber({}, { message: 'Duração do sono deve ser um número' })
  @Min(0, { message: 'Duração do sono não pode ser negativa' })
  duration: number;

  @ApiProperty({
    description: 'Qualidade do sono (0-100)',
    example: 85
  })
  @IsNumber({}, { message: 'Qualidade do sono deve ser um número' })
  @Min(0, { message: 'Qualidade do sono mínima é 0' })
  @Max(100, { message: 'Qualidade do sono máxima é 100' })
  quality: number;

  @ApiProperty({
    description: 'Fases do sono (minutos)',
    example: {
      'leve': 240,
      'profundo': 120,
      'rem': 90
    },
    required: false
  })
  @IsOptional()
  phases?: Record<string, number>;
}

export class CreateWearableMeasurementDto {
  @ApiProperty({
    description: 'ID do aluno',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do aluno deve ser uma string' })
  @IsNotEmpty({ message: 'ID do aluno é obrigatório' })
  studentId: string;

  @ApiProperty({
    description: 'Tipo do dispositivo',
    enum: WearableType,
    example: WearableType.SMARTWATCH
  })
  @IsEnum(WearableType, { message: 'Tipo de dispositivo inválido' })
  deviceType: WearableType;

  @ApiProperty({
    description: 'ID do dispositivo',
    example: 'garmin-forerunner-955-123456'
  })
  @IsString({ message: 'ID do dispositivo deve ser uma string' })
  @IsNotEmpty({ message: 'ID do dispositivo é obrigatório' })
  deviceId: string;

  @ApiProperty({
    description: 'Fonte dos dados',
    enum: DataSource,
    example: DataSource.GARMIN
  })
  @IsEnum(DataSource, { message: 'Fonte de dados inválida' })
  dataSource: DataSource;

  @ApiProperty({
    description: 'Data e hora da medição',
    example: '2024-01-20T10:00:00Z'
  })
  @IsDate({ message: 'Data da medição inválida' })
  @Type(() => Date)
  timestamp: Date;

  @ApiProperty({
    description: 'Dados de frequência cardíaca',
    type: HeartRateDataDto,
    required: false
  })
  @ValidateNested()
  @Type(() => HeartRateDataDto)
  @IsOptional()
  heartRate?: HeartRateDataDto;

  @ApiProperty({
    description: 'Dados de atividade',
    type: ActivityDataDto,
    required: false
  })
  @ValidateNested()
  @Type(() => ActivityDataDto)
  @IsOptional()
  activity?: ActivityDataDto;

  @ApiProperty({
    description: 'Dados de sono',
    type: SleepDataDto,
    required: false
  })
  @ValidateNested()
  @Type(() => SleepDataDto)
  @IsOptional()
  sleep?: SleepDataDto;

  @ApiProperty({
    description: 'Nível de estresse (0-100)',
    example: 35,
    required: false
  })
  @IsNumber({}, { message: 'Nível de estresse deve ser um número' })
  @Min(0, { message: 'Nível de estresse mínimo é 0' })
  @Max(100, { message: 'Nível de estresse máximo é 100' })
  @IsOptional()
  stressLevel?: number;

  @ApiProperty({
    description: 'Nível de energia (0-100)',
    example: 85,
    required: false
  })
  @IsNumber({}, { message: 'Nível de energia deve ser um número' })
  @Min(0, { message: 'Nível de energia mínimo é 0' })
  @Max(100, { message: 'Nível de energia máximo é 100' })
  @IsOptional()
  energyLevel?: number;

  @ApiProperty({
    description: 'Dados adicionais específicos do dispositivo',
    example: {
      'spo2': 98,
      'temperatura_corporal': 36.5
    },
    required: false
  })
  @IsOptional()
  additionalData?: Record<string, any>;
} 