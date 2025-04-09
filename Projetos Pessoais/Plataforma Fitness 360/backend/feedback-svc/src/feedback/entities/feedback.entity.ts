import { ApiProperty } from '@nestjs/swagger';

export class Feedback {
  @ApiProperty({ example: 1, description: 'ID único do feedback' })
  id: number;

  @ApiProperty({ example: 'Ótimo treino!', description: 'Comentário do feedback' })
  comentario: string;

  @ApiProperty({ example: 5, description: 'Nota do feedback (1-5)' })
  nota: number;

  @ApiProperty({ example: 1, description: 'ID do usuário que criou o feedback' })
  userId: number;

  @ApiProperty({ example: '2024-03-15T10:30:00.000Z', description: 'Data de criação do feedback' })
  createdAt: Date;
} 