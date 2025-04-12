import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExerciseDto {
  @ApiProperty({ description: 'Nome do exercício' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descrição do exercício' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Instruções de execução do exercício' })
  @IsString()
  @IsNotEmpty()
  instructions: string;

  @ApiProperty({ description: 'URL do vídeo demonstrativo', required: false })
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @ApiProperty({
    description: 'IDs dos equipamentos necessários',
    required: false,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  equipmentIds?: string[];

  @ApiProperty({ description: 'IDs dos grupos musculares trabalhados' })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  muscleGroupIds: string[];
}
