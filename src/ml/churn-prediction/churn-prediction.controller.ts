import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ChurnPredictionService } from './churn-prediction.service';
import { CreateChurnPredictionDto } from './dto/create-churn-prediction.dto';
import { ChurnPrediction } from './entities/churn-prediction.entity';

@ApiTags('Previsão de Cancelamento')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('churn-predictions')
export class ChurnPredictionController {
  constructor(private readonly churnPredictionService: ChurnPredictionService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova previsão de cancelamento' })
  @ApiResponse({ status: 201, description: 'Previsão criada com sucesso' })
  create(@Body() createChurnPredictionDto: CreateChurnPredictionDto): Promise<ChurnPrediction> {
    return this.churnPredictionService.create(createChurnPredictionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as previsões de cancelamento' })
  @ApiResponse({ status: 200, description: 'Lista de previsões retornada com sucesso' })
  findAll(): Promise<ChurnPrediction[]> {
    return this.churnPredictionService.findAll();
  }

  @Get('high-risk')
  @ApiOperation({ summary: 'Listar alunos com alto risco de cancelamento' })
  @ApiResponse({ status: 200, description: 'Lista de alunos em risco retornada com sucesso' })
  findHighRiskStudents(): Promise<ChurnPrediction[]> {
    return this.churnPredictionService.findHighRiskStudents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar previsão por ID' })
  @ApiResponse({ status: 200, description: 'Previsão encontrada com sucesso' })
  @ApiResponse({ status: 404, description: 'Previsão não encontrada' })
  findOne(@Param('id') id: string): Promise<ChurnPrediction> {
    return this.churnPredictionService.findOne(id);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Buscar previsões por aluno' })
  @ApiResponse({ status: 200, description: 'Lista de previsões do aluno retornada com sucesso' })
  findByStudent(@Param('studentId') studentId: string): Promise<ChurnPrediction[]> {
    return this.churnPredictionService.findByStudent(studentId);
  }

  @Put(':id/contact')
  @ApiOperation({ summary: 'Atualizar informações de contato' })
  @ApiResponse({ status: 200, description: 'Informações de contato atualizadas com sucesso' })
  @ApiResponse({ status: 404, description: 'Previsão não encontrada' })
  updateContactInfo(
    @Param('id') id: string,
    @Body('wasContacted') wasContacted: boolean,
    @Body('contactDate') contactDate: Date,
    @Body('contactNotes') contactNotes: string,
  ): Promise<ChurnPrediction> {
    return this.churnPredictionService.updateContactInfo(id, wasContacted, contactDate, contactNotes);
  }

  @Put(':id/retention')
  @ApiOperation({ summary: 'Atualizar resultado da retenção' })
  @ApiResponse({ status: 200, description: 'Resultado da retenção atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Previsão não encontrada' })
  updateRetentionOutcome(
    @Param('id') id: string,
    @Body('retentionOutcome') retentionOutcome: boolean,
  ): Promise<ChurnPrediction> {
    return this.churnPredictionService.updateRetentionOutcome(id, retentionOutcome);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover previsão' })
  @ApiResponse({ status: 200, description: 'Previsão removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Previsão não encontrada' })
  remove(@Param('id') id: string): Promise<void> {
    return this.churnPredictionService.remove(id);
  }
} 