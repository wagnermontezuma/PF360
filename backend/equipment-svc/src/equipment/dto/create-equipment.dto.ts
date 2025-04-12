import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional, IsNumber, Min, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum EquipmentType {
  CARDIO = 'cardio',
  FORCA = 'forca',
  FUNCIONAL = 'funcional',
  ACESSORIO = 'acessorio'
}

enum MaintenanceFrequency {
  DIARIA = 'diaria',
  SEMANAL = 'semanal',
  QUINZENAL = 'quinzenal',
  MENSAL = 'mensal',
  TRIMESTRAL = 'trimestral'
}

class MaintenanceRequirementsDto {
  @ApiProperty({
    description: 'Frequência de manutenção preventiva',
    enum: MaintenanceFrequency,
    example: MaintenanceFrequency.MENSAL
  })
  @IsEnum(MaintenanceFrequency, { message: 'Frequência de manutenção inválida' })
  frequency: MaintenanceFrequency;

  @ApiProperty({
    description: 'Checklist de manutenção',
    example: ['Verificar lubrificação', 'Testar sistema elétrico']
  })
  @IsArray({ message: 'Checklist deve ser um array' })
  @IsString({ each: true, message: 'Itens do checklist devem ser strings' })
  checklist: string[];

  @ApiProperty({
    description: 'Observações especiais',
    example: 'Necessita calibração específica',
    required: false
  })
  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  notes?: string;
}

class SpecificationsDto {
  @ApiProperty({
    description: 'Dimensões (cm)',
    example: { comprimento: 200, largura: 100, altura: 150 }
  })
  dimensions: {
    comprimento: number;
    largura: number;
    altura: number;
  };

  @ApiProperty({
    description: 'Peso do equipamento (kg)',
    example: 150
  })
  @IsNumber({}, { message: 'Peso deve ser um número' })
  @Min(0, { message: 'Peso não pode ser negativo' })
  weight: number;

  @ApiProperty({
    description: 'Capacidade máxima de carga (kg)',
    example: 200,
    required: false
  })
  @IsNumber({}, { message: 'Capacidade deve ser um número' })
  @Min(0, { message: 'Capacidade não pode ser negativa' })
  @IsOptional()
  maxWeight?: number;

  @ApiProperty({
    description: 'Requer energia elétrica',
    example: true
  })
  @IsBoolean({ message: 'Requer energia deve ser um booleano' })
  requiresPower: boolean;

  @ApiProperty({
    description: 'Especificações técnicas adicionais',
    example: {
      'motor': '2.5 HP',
      'velocidade_maxima': '20 km/h'
    },
    required: false
  })
  @IsOptional()
  technicalSpecs?: Record<string, any>;
}

export class CreateEquipmentDto {
  @ApiProperty({
    description: 'Nome do equipamento',
    example: 'Esteira Profissional X3000'
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Marca do equipamento',
    example: 'TechnoGym'
  })
  @IsString({ message: 'Marca deve ser uma string' })
  @IsNotEmpty({ message: 'Marca é obrigatória' })
  brand: string;

  @ApiProperty({
    description: 'Modelo do equipamento',
    example: 'X3000-PRO'
  })
  @IsString({ message: 'Modelo deve ser uma string' })
  @IsNotEmpty({ message: 'Modelo é obrigatório' })
  model: string;

  @ApiProperty({
    description: 'Número de série',
    example: 'TG-X3000-2024-001'
  })
  @IsString({ message: 'Número de série deve ser uma string' })
  @IsNotEmpty({ message: 'Número de série é obrigatório' })
  serialNumber: string;

  @ApiProperty({
    description: 'Tipo do equipamento',
    enum: EquipmentType,
    example: EquipmentType.CARDIO
  })
  @IsEnum(EquipmentType, { message: 'Tipo de equipamento inválido' })
  type: EquipmentType;

  @ApiProperty({
    description: 'Data de aquisição',
    example: '2024-01-20'
  })
  @IsString({ message: 'Data de aquisição deve ser uma string' })
  @IsNotEmpty({ message: 'Data de aquisição é obrigatória' })
  acquisitionDate: string;

  @ApiProperty({
    description: 'Valor de aquisição (R$)',
    example: 25000.00
  })
  @IsNumber({}, { message: 'Valor deve ser um número' })
  @Min(0, { message: 'Valor não pode ser negativo' })
  acquisitionValue: number;

  @ApiProperty({
    description: 'Vida útil estimada (anos)',
    example: 5
  })
  @IsNumber({}, { message: 'Vida útil deve ser um número' })
  @Min(1, { message: 'Vida útil deve ser maior que 0' })
  estimatedLifespan: number;

  @ApiProperty({
    description: 'Localização na academia',
    example: 'Área de musculação - Setor 2'
  })
  @IsString({ message: 'Localização deve ser uma string' })
  @IsNotEmpty({ message: 'Localização é obrigatória' })
  location: string;

  @ApiProperty({
    description: 'Status de operação',
    example: true
  })
  @IsBoolean({ message: 'Status deve ser um booleano' })
  isOperational: boolean;

  @ApiProperty({
    description: 'Requisitos de manutenção',
    type: MaintenanceRequirementsDto
  })
  @ValidateNested()
  @Type(() => MaintenanceRequirementsDto)
  maintenanceRequirements: MaintenanceRequirementsDto;

  @ApiProperty({
    description: 'Especificações técnicas',
    type: SpecificationsDto
  })
  @ValidateNested()
  @Type(() => SpecificationsDto)
  specifications: SpecificationsDto;

  @ApiProperty({
    description: 'Grupos musculares trabalhados',
    example: ['peitoral', 'ombros', 'tríceps'],
    required: false
  })
  @IsArray({ message: 'Grupos musculares deve ser um array' })
  @IsString({ each: true, message: 'Grupos musculares devem ser strings' })
  @IsOptional()
  muscleGroups?: string[];

  @ApiProperty({
    description: 'Observações gerais',
    example: 'Equipamento com garantia estendida',
    required: false
  })
  @IsString({ message: 'Observações devem ser uma string' })
  @IsOptional()
  notes?: string;
} 