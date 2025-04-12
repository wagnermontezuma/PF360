import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity('churn_predictions')
export class ChurnPrediction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Student)
    @JoinColumn({ name: 'student_id' })
    student: Student;

    @Column({ name: 'student_id' })
    studentId: string;

    @Column('float')
    probability: number;

    @Column('jsonb')
    features: Record<string, any>;

    @Column('jsonb', { nullable: true })
    interventions: Record<string, any>[];

    @Column({ default: false })
    isHighRisk: boolean;

    @Column({ default: false })
    wasContacted: boolean;

    @Column({ nullable: true })
    contactDate: Date;

    @Column({ nullable: true })
    contactNotes: string;

    @Column({ nullable: true })
    retentionOutcome: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
} 