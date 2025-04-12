import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty({
    description: 'Nota de avaliação (1-5)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  nota: number;

  @ApiProperty({
    description: 'Comentário detalhado do feedback',
    example: 'O aplicativo é muito intuitivo e fácil de usar. Estou muito satisfeito com a experiência.',
  })
  @IsString()
  @IsNotEmpty()
  comentario: string;
} 