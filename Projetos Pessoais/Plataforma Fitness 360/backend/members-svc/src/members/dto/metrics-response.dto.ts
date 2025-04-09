import { ApiProperty } from '@nestjs/swagger';

export class MetricsResponseDto {
  @ApiProperty({ description: 'Número total de membros' })
  totalMembers: number;

  @ApiProperty({ description: 'Número de membros ativos' })
  activeMembers: number;

  @ApiProperty({ description: 'Número de membros premium' })
  premiumMembers: number;

  @ApiProperty({ description: 'Taxa de ativação em porcentagem' })
  activationRate: number;

  @ApiProperty({ description: 'Taxa de membros premium em porcentagem' })
  premiumRate: number;
} 