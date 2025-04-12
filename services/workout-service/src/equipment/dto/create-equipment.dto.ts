import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateEquipmentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;
} 