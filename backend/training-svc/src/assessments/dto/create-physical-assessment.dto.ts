import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional, IsNumber, Min, Max, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum BodyCompositionMethod {
  DOBRAS = 'dobras',
  BIOIMPEDANCIA = 'bioimpedancia',
  DEXA = 'dexa',
  PERIMETRIA = 'perimetria'
}

class AnthropometricMeasurementsDto {
  @ApiProperty({
    description: 'Peso (kg)',
    example: 75.5
  })
  @IsNumber({}, { message: 'Peso deve ser um número' })
  @Min(20, { message: 'Peso mínimo é 20kg' })
  @Max(300, { message: 'Peso máximo é 300kg' })
  weight: number;

  @ApiProperty({
    description: 'Altura (cm)',
    example: 175
  })
  @IsNumber({}, { message: 'Altura deve ser um número' })
  @Min(100, { message: 'Altura mínima é 100cm' })
  @Max(250, { message: 'Altura máxima é 250cm' })
  height: number;

  @ApiProperty({
    description: 'Circunferência da cintura (cm)',
    example: 80
  })
  @IsNumber({}, { message: 'Circunferência da cintura deve ser um número' })
  @Min(40, { message: 'Circunferência mínima é 40cm' })
  @Max(200, { message: 'Circunferência máxima é 200cm' })
  waistCircumference: number;

  @ApiProperty({
    description: 'Circunferência do quadril (cm)',
    example: 95
  })
  @IsNumber({}, { message: 'Circunferência do quadril deve ser um número' })
  @Min(40, { message: 'Circunferência mínima é 40cm' })
  @Max(200, { message: 'Circunferência máxima é 200cm' })
  hipCircumference: number;

  @ApiProperty({
    description: 'Outras medidas (cm)',
    example: { 'braço_direito': 35, 'braço_esquerdo': 34.5 },
    required: false
  })
  @IsOptional()
  otherMeasurements?: Record<string, number>;
}

class BodyCompositionDto {
  @ApiProperty({
    description: 'Método de avaliação',
    enum: BodyCompositionMethod,
    example: BodyCompositionMethod.DOBRAS
  })
  @IsEnum(BodyCompositionMethod, { message: 'Método de avaliação inválido' })
  method: BodyCompositionMethod;

  @ApiProperty({
    description: 'Percentual de gordura corporal',
    example: 20.5
  })
  @IsNumber({}, { message: 'Percentual de gordura deve ser um número' })
  @Min(0, { message: 'Percentual mínimo é 0%' })
  @Max(70, { message: 'Percentual máximo é 70%' })
  bodyFatPercentage: number;

  @ApiProperty({
    description: 'Massa magra (kg)',
    example: 60
  })
  @IsNumber({}, { message: 'Massa magra deve ser um número' })
  @Min(20, { message: 'Massa magra mínima é 20kg' })
  @Max(200, { message: 'Massa magra máxima é 200kg' })
  leanMass: number;

  @ApiProperty({
    description: 'Massa gorda (kg)',
    example: 15.5
  })
  @IsNumber({}, { message: 'Massa gorda deve ser um número' })
  @Min(0, { message: 'Massa gorda mínima é 0kg' })
  @Max(200, { message: 'Massa gorda máxima é 200kg' })
  fatMass: number;

  @ApiProperty({
    description: 'Medidas específicas do método',
    example: { 'dobra_tricipital': 15, 'dobra_subescapular': 20 },
    required: false
  })
  @IsOptional()
  methodSpecificMeasurements?: Record<string, number>;
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
    description: 'ID do avaliador',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do avaliador deve ser uma string' })
  @IsNotEmpty({ message: 'ID do avaliador é obrigatório' })
  assessorId: string;

  @ApiProperty({
    description: 'Data da avaliação',
    example: '2024-01-20T10:00:00Z'
  })
  @IsDate({ message: 'Data da avaliação inválida' })
  @Type(() => Date)
  assessmentDate: Date;

  @ApiProperty({
    description: 'Medidas antropométricas',
    type: AnthropometricMeasurementsDto
  })
  @ValidateNested()
  @Type(() => AnthropometricMeasurementsDto)
  anthropometricMeasurements: AnthropometricMeasurementsDto;

  @ApiProperty({
    description: 'Composição corporal',
    type: BodyCompositionDto
  })
  @ValidateNested()
  @Type(() => BodyCompositionDto)
  bodyComposition: BodyCompositionDto;

  @ApiProperty({
    description: 'Objetivos do aluno',
    example: ['Hipertrofia', 'Redução de gordura']
  })
  @IsArray({ message: 'Objetivos deve ser um array' })
  @IsString({ each: true, message: 'Objetivos devem ser strings' })
  goals: string[];

  @ApiProperty({
    description: 'Observações gerais',
    example: 'Aluno apresenta boa postura e mobilidade',
    required: false
  })
  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Restrições ou limitações',
    example: ['Lesão no joelho direito', 'Desvio postural leve'],
    required: false
  })
  @IsArray({ message: 'Restrições deve ser um array' })
  @IsString({ each: true, message: 'Restrições devem ser strings' })
  @IsOptional()
  restrictions?: string[];
} 