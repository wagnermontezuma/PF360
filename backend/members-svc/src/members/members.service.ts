import { Injectable } from '@nestjs/common';
import { MetricsResponseDto } from './dto/metrics-response.dto';

@Injectable()
export class MembersService {
  private readonly members = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@exemplo.com',
      plan: 'Premium',
      startDate: '2024-01-15',
      status: 'Ativo'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@exemplo.com',
      plan: 'Basic',
      startDate: '2024-02-01',
      status: 'Ativo'
    },
    {
      id: 3,
      name: 'Pedro Oliveira',
      email: 'pedro@exemplo.com',
      plan: 'Premium',
      startDate: '2024-01-10',
      status: 'Inativo'
    }
  ];

  async findAll() {
    return this.members;
  }

  async getMetrics(): Promise<MetricsResponseDto> {
    const totalMembers = this.members.length;
    const activeMembers = this.members.filter(m => m.status === 'Ativo').length;
    const premiumMembers = this.members.filter(m => m.plan === 'Premium').length;

    return {
      totalMembers,
      activeMembers,
      premiumMembers,
      activationRate: (activeMembers / totalMembers) * 100,
      premiumRate: (premiumMembers / totalMembers) * 100
    };
  }
} 