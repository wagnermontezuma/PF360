import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMuscleGroupDto {
  @ApiProperty({
    description: 'Nome do grupo muscular',
    example: 'Peitoral',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Descrição do grupo muscular',
    example: 'Músculos do peito',
    required: false,
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500)
  description?: string;
}
