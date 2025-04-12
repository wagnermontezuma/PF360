import { Injectable, Logger, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Training } from '../../training/entities/training.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { Assessment } from '../../assessment/entities/assessment.entity';
import { PythonShell } from 'python-shell';
import { join } from 'path';
import { ChurnPrediction } from './entities/churn-prediction.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateChurnPredictionDto } from './dto/create-churn-prediction.dto';

@Injectable()
export class ChurnPredictionService implements OnModuleInit {
    private readonly logger = new Logger(ChurnPredictionService.name);
    private modelPath: string;

    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
        @InjectRepository(Training)
        private trainingRepository: Repository<Training>,
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(Feedback)
        private feedbackRepository: Repository<Feedback>,
        @InjectRepository(Assessment)
        private assessmentRepository: Repository<Assessment>,
        @InjectRepository(ChurnPrediction)
        private churnPredictionRepository: Repository<ChurnPrediction>
    ) {
        this.modelPath = join(process.cwd(), 'src/ml/churn-prediction/model.joblib');
    }

    async onModuleInit() {
        await this.trainModel();
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async runDailyPredictions() {
        this.logger.log('Iniciando previsões diárias de cancelamento...');
        const students = await this.studentRepository.find({ 
            where: { active: true } 
        });

        for (const student of students) {
            await this.predictChurnForStudent(student.id);
        }
        this.logger.log('Previsões diárias concluídas');
    }

    private async getStudentFeatures(studentId: number) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));

        // Frequência
        const lastAttendance = await this.attendanceRepository.findOne({
            where: { studentId },
            order: { createdAt: 'DESC' }
        });

        const attendanceCount = await this.attendanceRepository.count({
            where: { 
                studentId,
                createdAt: { $gte: thirtyDaysAgo }
            }
        });

        // Engajamento
        const trainings = await this.trainingRepository.find({
            where: { 
                studentId,
                createdAt: { $gte: thirtyDaysAgo }
            }
        });

        const uniqueExercises = new Set(
            trainings.flatMap(t => t.exercises.map(e => e.id))
        ).size;

        // Financeiro
        const latePayments = await this.paymentRepository.count({
            where: {
                studentId,
                status: 'late',
                dueDate: { $gte: sixMonthsAgo }
            }
        });

        const student = await this.studentRepository.findOne({
            where: { id: studentId }
        });

        // Satisfação
        const feedback = await this.feedbackRepository.find({
            where: { 
                studentId,
                createdAt: { $gte: thirtyDaysAgo }
            }
        });

        // Progresso
        const assessments = await this.assessmentRepository.find({
            where: { 
                studentId,
                createdAt: { $gte: thirtyDaysAgo }
            }
        });

        return {
            dias_desde_ultima_entrada: lastAttendance 
                ? Math.floor((now.getTime() - lastAttendance.createdAt.getTime()) / (1000 * 60 * 60 * 24))
                : 30,
            media_entradas_semana: (attendanceCount / 4.3),
            total_faltas_30d: 30 - attendanceCount,
            
            taxa_conclusao_treinos: trainings.filter(t => t.completed).length / trainings.length,
            media_duracao_treino: trainings.reduce((acc, t) => acc + t.duration, 0) / trainings.length,
            variedade_exercicios: uniqueExercises,
            
            atrasos_pagamento_6m: latePayments,
            valor_mensalidade: student.monthlyFee,
            tempo_cliente_meses: Math.floor((now.getTime() - student.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)),
            
            nota_media_aulas: feedback.reduce((acc, f) => acc + f.classRating, 0) / feedback.length,
            nota_media_instrutores: feedback.reduce((acc, f) => acc + f.instructorRating, 0) / feedback.length,
            nota_media_estrutura: feedback.reduce((acc, f) => acc + f.facilityRating, 0) / feedback.length,
            
            taxa_evolucao_carga: this.calculateLoadProgress(assessments),
            metas_alcancadas: assessments.filter(a => a.goalsAchieved).length,
            avaliacoes_realizadas: assessments.length
        };
    }

    private calculateLoadProgress(assessments: Assessment[]): number {
        if (assessments.length < 2) return 0;

        const sortedAssessments = assessments.sort((a, b) => 
            a.createdAt.getTime() - b.createdAt.getTime()
        );

        const initialLoads = sortedAssessments[0].exercises.map(e => e.load);
        const currentLoads = sortedAssessments[sortedAssessments.length - 1].exercises.map(e => e.load);

        const progressRates = initialLoads.map((initial, idx) => 
            (currentLoads[idx] - initial) / initial
        );

        return progressRates.reduce((acc, rate) => acc + rate, 0) / progressRates.length;
    }

    async predictChurnForStudent(studentId: number): Promise<ChurnPrediction> {
        try {
            const features = await this.getStudentFeatures(studentId);
            
            const options = {
                mode: 'text',
                pythonPath: 'python3',
                pythonOptions: ['-u'],
                scriptPath: join(process.cwd(), 'src/ml/churn-prediction'),
                args: [
                    '--model_path', this.modelPath,
                    '--features', JSON.stringify(features)
                ]
            };

            const results = await PythonShell.run('predict.py', options);
            const prediction = JSON.parse(results[0]);

            const churnPrediction = this.churnPredictionRepository.create({
                studentId,
                probability: prediction.churn_probability,
                riskFactors: prediction.principais_fatores,
                createdAt: new Date()
            });

            await this.churnPredictionRepository.save(churnPrediction);
            
            if (prediction.churn_probability > 0.7) {
                this.logger.warn(`Alto risco de cancelamento detectado para aluno ${studentId}`);
                // TODO: Implementar notificações e ações preventivas
            }

            return churnPrediction;

        } catch (error) {
            this.logger.error(`Erro ao prever cancelamento para aluno ${studentId}`, error);
            throw error;
        }
    }

    private async trainModel(): Promise<void> {
        try {
            this.logger.log('Iniciando treinamento do modelo de previsão de cancelamentos...');
            
            const students = await this.studentRepository.find();
            const features = await Promise.all(
                students.map(s => this.getStudentFeatures(s.id))
            );

            const options = {
                mode: 'text',
                pythonPath: 'python3',
                pythonOptions: ['-u'],
                scriptPath: join(process.cwd(), 'src/ml/churn-prediction'),
                args: [
                    '--features', JSON.stringify(features),
                    '--model_path', this.modelPath
                ]
            };

            const results = await PythonShell.run('train.py', options);
            const metrics = JSON.parse(results[0]);
            
            this.logger.log('Modelo treinado com sucesso', metrics);

        } catch (error) {
            this.logger.error('Erro ao treinar modelo', error);
            throw error;
        }
    }

    async getChurnPredictions(filters: {
        probability?: number,
        fromDate?: Date,
        toDate?: Date
    }): Promise<ChurnPrediction[]> {
        const query = this.churnPredictionRepository.createQueryBuilder('prediction');

        if (filters.probability) {
            query.where('prediction.probability >= :probability', { 
                probability: filters.probability 
            });
        }

        if (filters.fromDate) {
            query.andWhere('prediction.createdAt >= :fromDate', { 
                fromDate: filters.fromDate 
            });
        }

        if (filters.toDate) {
            query.andWhere('prediction.createdAt <= :toDate', { 
                toDate: filters.toDate 
            });
        }

        return query.getMany();
    }

    async create(createChurnPredictionDto: CreateChurnPredictionDto): Promise<ChurnPrediction> {
        const prediction = this.churnPredictionRepository.create({
            ...createChurnPredictionDto,
            isHighRisk: createChurnPredictionDto.probability >= 0.7,
        });
        return this.churnPredictionRepository.save(prediction);
    }

    async findAll(): Promise<ChurnPrediction[]> {
        return this.churnPredictionRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<ChurnPrediction> {
        const prediction = await this.churnPredictionRepository.findOne({ where: { id } });
        if (!prediction) {
            throw new NotFoundException(`Previsão de cancelamento #${id} não encontrada`);
        }
        return prediction;
    }

    async findByStudent(studentId: string): Promise<ChurnPrediction[]> {
        return this.churnPredictionRepository.find({
            where: { studentId },
            order: { createdAt: 'DESC' },
        });
    }

    async findHighRiskStudents(): Promise<ChurnPrediction[]> {
        return this.churnPredictionRepository.find({
            where: { isHighRisk: true, wasContacted: false },
            order: { probability: 'DESC' },
        });
    }

    async updateContactInfo(
        id: string,
        wasContacted: boolean,
        contactDate: Date,
        contactNotes: string,
    ): Promise<ChurnPrediction> {
        const prediction = await this.findOne(id);
        prediction.wasContacted = wasContacted;
        prediction.contactDate = contactDate;
        prediction.contactNotes = contactNotes;
        return this.churnPredictionRepository.save(prediction);
    }

    async updateRetentionOutcome(id: string, retentionOutcome: boolean): Promise<ChurnPrediction> {
        const prediction = await this.findOne(id);
        prediction.retentionOutcome = retentionOutcome;
        return this.churnPredictionRepository.save(prediction);
    }

    async remove(id: string): Promise<void> {
        const prediction = await this.findOne(id);
        await this.churnPredictionRepository.remove(prediction);
    }
} 