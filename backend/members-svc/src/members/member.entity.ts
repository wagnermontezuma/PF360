import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsUUID, IsDate, IsString, IsBoolean, IsNotEmpty, IsOptional, Length, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID único do membro' })
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @Length(3, 100, { message: 'O nome deve ter entre 3 e 100 caracteres' })
  @ApiProperty({ example: 'João Silva', description: 'Nome completo do membro' })
  name: string;

  @Column({ unique: true })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @ApiProperty({ example: 'joao@example.com', description: 'Email do membro' })
  email: string;

  @Column()
  @IsString()
  @IsNotEmpty({ message: 'O CPF é obrigatório' })
  @ApiProperty({ example: '123.456.789-00', description: 'CPF do membro' })
  cpf: string;

  @Column({ type: 'date' })
  @IsDate()
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória' })
  @ApiProperty({ example: '1990-01-01', description: 'Data de nascimento do membro' })
  dataNascimento: Date;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '(11) 99999-9999', description: 'Telefone do membro' })
  phone?: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Rua Exemplo, 123', description: 'Endereço do membro' })
  address?: string;

  @Column()
  @IsUUID()
  @IsNotEmpty({ message: 'O ID do plano é obrigatório' })
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID do plano contratado' })
  planoId: string;

  @Column()
  @IsString()
  @IsNotEmpty({ message: 'O nome do plano é obrigatório' })
  @ApiProperty({ example: 'Premium', description: 'Nome do plano contratado' })
  plan: string;

  @Column({ type: 'timestamp' })
  @IsDate()
  @IsNotEmpty({ message: 'A data de início é obrigatória' })
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Data de início do plano' })
  startDate: Date;

  @Column()
  @IsString()
  @IsNotEmpty({ message: 'O status é obrigatório' })
  @ApiProperty({ example: 'Ativo', description: 'Status do membro (Ativo, Inativo, Suspenso)' })
  status: string;

  @Column({ default: true })
  @IsBoolean()
  @ApiProperty({ example: true, description: 'Status de ativação da conta' })
  active: boolean;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID do inquilino (para multi-tenancy)' })
  tenantId?: string;

  @CreateDateColumn()
  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Data de criação da conta' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  @ApiProperty({ example: '2024-03-15T10:30:00.000Z', description: 'Data do último login' })
  lastLogin?: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2024-03-20T15:45:00.000Z', description: 'Data da última atualização' })
  updatedAt: Date;
} 