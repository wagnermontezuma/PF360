import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('exercises')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo exercício' })
  @ApiResponse({ status: 201, description: 'Exercício criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() createExerciseDto: CreateExerciseDto) {
    return this.exercisesService.create(createExerciseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os exercícios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de exercícios retornada com sucesso',
  })
  findAll() {
    return this.exercisesService.findAll();
  }

  @Get('muscle-group/:id')
  @ApiOperation({ summary: 'Buscar exercícios por grupo muscular' })
  findByMuscleGroup(@Param('id') id: string) {
    return this.exercisesService.findByMuscleGroup(id);
  }

  @Get('equipment/:id')
  @ApiOperation({ summary: 'Buscar exercícios por equipamento' })
  findByEquipment(@Param('id') id: string) {
    return this.exercisesService.findByEquipment(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar exercício por ID' })
  @ApiResponse({ status: 200, description: 'Exercício encontrado' })
  @ApiResponse({ status: 404, description: 'Exercício não encontrado' })
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar exercício' })
  @ApiResponse({ status: 200, description: 'Exercício atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Exercício não encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ) {
    return this.exercisesService.update(id, updateExerciseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover exercício' })
  @ApiResponse({ status: 200, description: 'Exercício removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Exercício não encontrado' })
  remove(@Param('id') id: string) {
    return this.exercisesService.remove(id);
  }

  @Put('reorder')
  @ApiOperation({ summary: 'Reordenar exercícios de um treino' })
  reorderExercises(
    @Query('workoutId') workoutId: string,
    @Body() exerciseIds: string[],
  ) {
    return this.exercisesService.reorderExercises(workoutId, exerciseIds);
  }
}
