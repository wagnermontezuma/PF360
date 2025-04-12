import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsArray, IsOptional, Matches } from 'class-validator';
import { NotificationType } from '../enums/notification.enum';

export class CreateTemplateDto {
  @ApiProperty({
    description: 'Tipo de notificação',
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    description: 'Título do template (suporta variáveis no formato {{variavel}})',
    example: 'Olá {{nome}}, seu treino está agendado!',
  })
  @IsString()
  @Matches(/^[^{}]*(\{\{[a-zA-Z0-9_]+\}\}[^{}]*)*$/, {
    message: 'Formato de variável inválido. Use {{nome_variavel}}',
  })
  title: string;

  @ApiProperty({
    description: 'Conteúdo do template (suporta variáveis no formato {{variavel}})',
    example: 'Seu treino de {{tipo_treino}} está marcado para {{horario}}.',
  })
  @IsString()
  @Matches(/^[^{}]*(\{\{[a-zA-Z0-9_]+\}\}[^{}]*)*$/, {
    message: 'Formato de variável inválido. Use {{nome_variavel}}',
  })
  content: string;

  @ApiProperty({
    description: 'Idioma do template (padrão: pt-BR)',
    example: 'pt-BR',
    default: 'pt-BR',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z]{2}-[A-Z]{2}$/, {
    message: 'Idioma deve estar no formato xx-XX (ex: pt-BR)',
  })
  language?: string;

  @ApiProperty({
    description: 'Lista de variáveis utilizadas no template',
    example: ['nome', 'tipo_treino', 'horario'],
  })
  @IsArray()
  @IsString({ each: true })
  variables: string[];
} 