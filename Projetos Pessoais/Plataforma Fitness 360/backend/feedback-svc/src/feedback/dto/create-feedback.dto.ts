import { IsNotEmpty, IsString, IsUUID, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty({ description: 'ID do usuário que está enviando o feedback' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Título do feedback' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @ApiProperty({ description: 'Conteúdo do feedback' })
  @IsNotEmpty()
  @IsString()
  @Length(10, 1000)
  content: string;

  @ApiProperty({ description: 'Categoria do feedback', required: false })
  @IsOptional()
  @IsString()
  category?: string;
} 