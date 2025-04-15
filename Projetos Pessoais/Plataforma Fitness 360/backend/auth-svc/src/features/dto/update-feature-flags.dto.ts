import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateFeatureFlagsDto {
  @ApiProperty({ description: 'Ativa feedback beta', required: false })
  @IsBoolean()
  @IsOptional()
  betaFeedback?: boolean;

  @ApiProperty({ description: 'Ativa seção de melhorias', required: false })
  @IsBoolean()
  @IsOptional()
  improvementsSection?: boolean;

  @ApiProperty({ description: 'Ativa recomendações de treino com IA', required: false })
  @IsBoolean()
  @IsOptional()
  aiTrainingRecommendations?: boolean;

  @ApiProperty({ description: 'Ativa acompanhamento nutricional', required: false })
  @IsBoolean()
  @IsOptional()
  nutritionTracking?: boolean;

  @ApiProperty({ description: 'Ativa módulo de aulas em grupo', required: false })
  @IsBoolean()
  @IsOptional()
  groupClasses?: boolean;

  @ApiProperty({ description: 'Ativa fotos de progresso', required: false })
  @IsBoolean()
  @IsOptional()
  progressPictures?: boolean;

  @ApiProperty({ description: 'Ativa chat com personal trainer', required: false })
  @IsBoolean()
  @IsOptional()
  personalTrainerChat?: boolean;

  @ApiProperty({ description: 'Ativa módulo de desafios', required: false })
  @IsBoolean()
  @IsOptional()
  challengeModule?: boolean;
} 