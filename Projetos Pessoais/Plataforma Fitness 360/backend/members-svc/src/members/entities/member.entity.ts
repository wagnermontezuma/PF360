import { ApiProperty } from '@nestjs/swagger';

export class Member {
  @ApiProperty({ example: 1, description: 'ID único do membro' })
  id: number;

  @ApiProperty({ example: 'João Silva', description: 'Nome completo do membro' })
  name: string;

  @ApiProperty({ example: 'joao@example.com', description: 'Email do membro' })
  email: string;

  @ApiProperty({ example: 'Premium', description: 'Plano atual do membro' })
  plan: string;

  @ApiProperty({ example: true, description: 'Status de ativação da conta' })
  active: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Data de criação da conta' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-15T10:30:00.000Z', description: 'Data do último login' })
  lastLogin: Date;
} 