import { IsString, IsNotEmpty, IsEnum, IsArray, IsOptional, IsNumber, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum ExerciseType {
  RESISTENCIA = 'resistencia',
  FORCA = 'forca',
  FLEXIBILIDADE = 'flexibilidade',
  CARDIO = 'cardio',
  EQUILIBRIO = 'equilibrio',
  FUNCIONAL = 'funcional'
}

enum MuscleGroup {
  PEITO = 'peito',
  COSTAS = 'costas',
  OMBROS = 'ombros',
  BICEPS = 'biceps',
  TRICEPS = 'triceps',
  PERNAS = 'pernas',
  ABDOMEN = 'abdomen',
  GLUTEOS = 'gluteos',
  CORE = 'core'
}

enum DifficultyLevel {
  INICIANTE = 'iniciante',
  INTERMEDIARIO = 'intermediario',
  AVANCADO = 'avancado'
}

class ExerciseMediaDto {
  @ApiProperty({
    description: 'URL do vídeo demonstrativo',
    example: 'https://videos.fitness360.com/supino-reto.mp4',
    required: false
  })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({
    description: 'URLs das imagens demonstrativas',
    example: ['https://images.fitness360.com/supino-1.jpg'],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];
}

class ExerciseEquipmentDto {
  @ApiProperty({
    description: 'ID do equipamento',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString()
  @IsNotEmpty()
  equipmentId: string;

  @ApiProperty({
    description: 'Configuração específica do equipamento',
    example: 'Inclinação: 30°',
    required: false
  })
  @IsString()
  @IsOptional()
  configuration?: string;
}

export class CreateExerciseDto {
  @ApiProperty({
    description: 'Nome do exercício',
    example: 'Supino Reto'
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Descrição do exercício',
    example: 'Exercício para desenvolvimento do peitoral'
  })
  @IsString()
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  description: string;

  @ApiProperty({
    description: 'Tipo do exercício',
    enum: ExerciseType,
    example: ExerciseType.FORCA
  })
  @IsEnum(ExerciseType)
  type: ExerciseType;

  @ApiProperty({
    description: 'Grupos musculares trabalhados',
    enum: MuscleGroup,
    isArray: true,
    example: [MuscleGroup.PEITO, MuscleGroup.TRICEPS]
  })
  @IsArray()
  @IsEnum(MuscleGroup, { each: true })
  muscleGroups: MuscleGroup[];

  @ApiProperty({
    description: 'Nível de dificuldade',
    enum: DifficultyLevel,
    example: DifficultyLevel.INTERMEDIARIO
  })
  @IsEnum(DifficultyLevel)
  difficultyLevel: DifficultyLevel;

  @ApiProperty({
    description: 'Instruções de execução',
    example: ['Deite no banco', 'Segure a barra com as mãos afastadas']
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  instructions: string[];

  @ApiProperty({
    description: 'Dicas de execução',
    example: ['Mantenha os cotovelos alinhados', 'Respire durante o movimento'],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tips?: string[];

  @ApiProperty({
    description: 'Média de calorias gastas por minuto',
    example: 5.5,
    required: false
  })
  @IsNumber()
  @Min(0)
  @Max(50)
  @IsOptional()
  caloriesPerMinute?: number;

  @ApiProperty({
    description: 'Mídia do exercício',
    type: ExerciseMediaDto,
    required: false
  })
  @ValidateNested()
  @Type(() => ExerciseMediaDto)
  @IsOptional()
  media?: ExerciseMediaDto;

  @ApiProperty({
    description: 'Equipamentos necessários',
    type: [ExerciseEquipmentDto],
    required: false
  })
  @ValidateNested({ each: true })
  @Type(() => ExerciseEquipmentDto)
  @IsOptional()
  equipment?: ExerciseEquipmentDto[];

  @ApiProperty({
    description: 'Tags para categorização',
    example: ['musculação', 'peito', 'iniciante'],
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
} 