import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MembersService } from './members.service';
import { Member } from './entities/member.entity';

interface MemberResponse {
  id: number;
  name: string;
  email: string;
  plan: string;
  startDate: string;
  status: string;
}

class MetricsResponseDto {
  totalMembers: number;
  activeMembers: number;
  premiumMembers: number;
  activationRate: number;
  premiumRate: number;
}

@ApiTags('members')
@Controller('members')
@UseGuards(JwtAuthGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os membros' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de membros retornada com sucesso',
    type: Array<MemberResponse>
  })
  async findAll(): Promise<MemberResponse[]> {
    return this.membersService.findAll();
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Retorna métricas dos membros' })
  @ApiResponse({
    status: 200,
    description: 'Métricas retornadas com sucesso',
    type: MetricsResponseDto
  })
  async getMetrics(): Promise<MetricsResponseDto> {
    return this.membersService.getMetrics();
  }
} 