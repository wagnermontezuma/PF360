import { IsString, IsNotEmpty, IsNumber, IsEnum, IsDate, IsOptional, Min, Max, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum FeedbackCategory {
  TREINO = 'treino',
  INSTRUTOR = 'instrutor',
  ESTRUTURA = 'estrutura',
  ATENDIMENTO = 'atendimento',
  APP = 'app'
}

enum SatisfactionLevel {
  MUITO_INSATISFEITO = 'muito_insatisfeito',
  INSATISFEITO = 'insatisfeito',
  NEUTRO = 'neutro',
  SATISFEITO = 'satisfeito',
  MUITO_SATISFEITO = 'muito_satisfeito'
}

class CategoryFeedbackDto {
  @ApiProperty({
    description: 'Categoria do feedback',
    enum: FeedbackCategory,
    example: FeedbackCategory.TREINO
  })
  @IsEnum(FeedbackCategory, { message: 'Categoria inválida' })
  category: FeedbackCategory;

  @ApiProperty({
    description: 'Nível de satisfação',
    enum: SatisfactionLevel,
    example: SatisfactionLevel.SATISFEITO
  })
  @IsEnum(SatisfactionLevel, { message: 'Nível de satisfação inválido' })
  satisfaction: SatisfactionLevel;

  @ApiProperty({
    description: 'Nota de 0 a 10',
    example: 9,
    minimum: 0,
    maximum: 10
  })
  @IsNumber({}, { message: 'Nota deve ser um número' })
  @Min(0, { message: 'Nota mínima é 0' })
  @Max(10, { message: 'Nota máxima é 10' })
  rating: number;

  @ApiProperty({
    description: 'Comentário específico da categoria',
    example: 'Os treinos são desafiadores e bem estruturados',
    required: false
  })
  @IsString({ message: 'Comentário deve ser uma string' })
  @IsOptional()
  comment?: string;
}

class ImprovementSuggestionDto {
  @ApiProperty({
    description: 'Categoria da sugestão',
    enum: FeedbackCategory,
    example: FeedbackCategory.ESTRUTURA
  })
  @IsEnum(FeedbackCategory, { message: 'Categoria inválida' })
  category: FeedbackCategory;

  @ApiProperty({
    description: 'Descrição da sugestão de melhoria',
    example: 'Seria ótimo ter mais equipamentos de musculação'
  })
  @IsString({ message: 'Descrição deve ser uma string' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  description: string;

  @ApiProperty({
    description: 'Prioridade sugerida (1-5)',
    example: 4,
    minimum: 1,
    maximum: 5
  })
  @IsNumber({}, { message: 'Prioridade deve ser um número' })
  @Min(1, { message: 'Prioridade mínima é 1' })
  @Max(5, { message: 'Prioridade máxima é 5' })
  priority: number;
}

export class CreateStudentFeedbackDto {
  @ApiProperty({
    description: 'ID do aluno',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsString({ message: 'ID do aluno deve ser uma string' })
  @IsNotEmpty({ message: 'ID do aluno é obrigatório' })
  studentId: string;

  @ApiProperty({
    description: 'Data do feedback',
    example: '2024-03-15T10:00:00Z'
  })
  @Type(() => Date)
  @IsDate({ message: 'Data do feedback inválida' })
  @IsNotEmpty({ message: 'Data do feedback é obrigatória' })
  feedbackDate: Date;

  @ApiProperty({
    description: 'Net Promoter Score (0-10)',
    example: 9,
    minimum: 0,
    maximum: 10
  })
  @IsNumber({}, { message: 'NPS deve ser um número' })
  @Min(0, { message: 'NPS mínimo é 0' })
  @Max(10, { message: 'NPS máximo é 10' })
  npsScore: number;

  @ApiProperty({
    description: 'Feedbacks por categoria',
    type: [CategoryFeedbackDto],
    minItems: 1
  })
  @IsArray({ message: 'Feedbacks deve ser um array' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Inclua pelo menos um feedback por categoria' })
  @Type(() => CategoryFeedbackDto)
  categoryFeedbacks: CategoryFeedbackDto[];

  @ApiProperty({
    description: 'Sugestões de melhoria',
    type: [ImprovementSuggestionDto],
    required: false
  })
  @IsArray({ message: 'Sugestões deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => ImprovementSuggestionDto)
  @IsOptional()
  improvementSuggestions?: ImprovementSuggestionDto[];

  @ApiProperty({
    description: 'Comentário geral',
    example: 'Estou muito satisfeito com a academia no geral',
    required: false
  })
  @IsString({ message: 'Comentário geral deve ser uma string' })
  @IsOptional()
  generalComment?: string;
} 