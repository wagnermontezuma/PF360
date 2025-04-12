import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './feedback.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('feedback')
@Controller('feedback')
@ApiBearerAuth()
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo feedback' })
  @ApiResponse({ status: 201, description: 'Feedback criado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os feedbacks ou filtrar por usuário' })
  @ApiQuery({ name: 'userId', required: false, description: 'ID do usuário para filtrar feedbacks' })
  @ApiResponse({ status: 200, description: 'Lista de feedbacks retornada com sucesso' })
  findAll() {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar feedback por ID' })
  @ApiResponse({ status: 200, description: 'Feedback encontrado' })
  @ApiResponse({ status: 404, description: 'Feedback não encontrado' })
  findOne(@Param('id') id: string) {
    return this.feedbackService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Listar feedbacks de um usuário' })
  @ApiResponse({ status: 200, description: 'Lista de feedbacks retornada com sucesso' })
  findByUserId(@Param('userId') userId: string) {
    return this.feedbackService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar feedback' })
  @ApiResponse({ status: 200, description: 'Feedback atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Feedback não encontrado' })
  update(@Param('id') id: string, @Body() updateFeedbackDto: Partial<CreateFeedbackDto>) {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover feedback' })
  @ApiResponse({ status: 200, description: 'Feedback removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Feedback não encontrado' })
  remove(@Param('id') id: string) {
    return this.feedbackService.remove(id);
  }

  @Get('metrics/average')
  @ApiOperation({ summary: 'Obter a pontuação média dos feedbacks' })
  @ApiResponse({ status: 200, description: 'Pontuação média dos feedbacks retornada com sucesso' })
  getAverageScore() {
    return this.feedbackService.getAverageScore();
  }
} 