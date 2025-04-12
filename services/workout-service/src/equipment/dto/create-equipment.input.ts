import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEquipmentInput {
  @ApiProperty({ description: 'Nome do equipamento' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descrição do equipamento', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
