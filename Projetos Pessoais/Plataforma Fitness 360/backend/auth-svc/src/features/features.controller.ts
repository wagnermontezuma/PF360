import { Controller, Get, Put, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FeaturesService } from './features.service';
import { UpdateFeatureFlagsDto } from './dto/update-feature-flags.dto';

@ApiTags('features')
@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtém as feature flags do usuário' })
  async getUserFeatures(@Request() req) {
    const userId = req.user.id;
    return this.featuresService.getUserFeatures(userId);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza as feature flags do usuário (requer permissão)' })
  async updateUserFeatures(
    @Request() req,
    @Body(ValidationPipe) updateFeatureFlagsDto: UpdateFeatureFlagsDto,
  ) {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';
    
    // Apenas administradores podem atualizar flags
    if (!isAdmin) {
      return {
        success: false,
        message: 'Permissão negada. Apenas administradores podem atualizar feature flags.',
      };
    }
    
    return this.featuresService.updateUserFeatures(userId, updateFeatureFlagsDto);
  }
} 