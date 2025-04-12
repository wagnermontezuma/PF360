import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, Query } from '@nestjs/common';
import { NutritionService } from './nutrition.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('nutrition')
@ApiBearerAuth()
@Controller('nutrition')
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}

  @Get('plans')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar todos os planos nutricionais do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de planos nutricionais retornada com sucesso' })
  async findAll(@Req() req) {
    return this.nutritionService.findAll(req.user.id);
  }

  @Get('plans/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obter um plano nutricional específico' })
  @ApiResponse({ status: 200, description: 'Plano nutricional encontrado' })
  @ApiResponse({ status: 404, description: 'Plano nutricional não encontrado' })
  async findOne(@Param('id') id: string, @Req() req) {
    return this.nutritionService.findOne(id, req.user.id);
  }

  @Post('plans')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar um novo plano nutricional' })
  @ApiResponse({ status: 201, description: 'Plano nutricional criado com sucesso' })
  async create(@Body() data: any, @Req() req) {
    return this.nutritionService.create(data, req.user.id);
  }

  @Put('plans/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar um plano nutricional existente' })
  @ApiResponse({ status: 200, description: 'Plano nutricional atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano nutricional não encontrado' })
  async update(@Param('id') id: string, @Body() data: any, @Req() req) {
    return this.nutritionService.update(id, data, req.user.id);
  }

  @Delete('plans/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remover um plano nutricional' })
  @ApiResponse({ status: 200, description: 'Plano nutricional removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano nutricional não encontrado' })
  async remove(@Param('id') id: string, @Req() req) {
    return this.nutritionService.remove(id, req.user.id);
  }

  @Put('plans/:id/meals')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar refeições de um plano nutricional' })
  @ApiResponse({ status: 200, description: 'Refeições atualizadas com sucesso' })
  @ApiResponse({ status: 404, description: 'Plano nutricional não encontrado' })
  async updateMeals(
    @Param('id') id: string,
    @Body('meals') meals: any[],
    @Req() req,
  ) {
    return this.nutritionService.updateMeals(id, meals, req.user.id);
  }

  @Get('statistics')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obter estatísticas de calorias para um período' })
  @ApiResponse({ status: 200, description: 'Estatísticas obtidas com sucesso' })
  async getCaloriesStatistics(
    @Req() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.nutritionService.getCaloriesStatistics(
      req.user.id,
      new Date(startDate),
      new Date(endDate),
    );
  }
} 