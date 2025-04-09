import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsUUID, IsDate, IsString, IsBoolean } from 'class-validator';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column()
  @IsString()
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  cpf: string;

  @Column({ type: 'date' })
  @IsDate()
  dataNascimento: Date;

  @Column()
  @IsUUID()
  planoId: string;

  @Column()
  @IsString()
  plan: string;

  @Column({ type: 'timestamp' })
  @IsDate()
  startDate: Date;

  @Column()
  @IsString()
  status: string;

  @Column({ default: true })
  @IsBoolean()
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 