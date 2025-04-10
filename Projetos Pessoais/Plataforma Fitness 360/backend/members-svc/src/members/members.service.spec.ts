import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';

describe('MembersService', () => {
  let service: MembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembersService],
    }).compile();

    service = module.get<MembersService>(MembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      const result = await service.findAll();
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      
      // Verificar estrutura de um membro
      const member = result[0];
      expect(member).toHaveProperty('id');
      expect(member).toHaveProperty('name');
      expect(member).toHaveProperty('email');
      expect(member).toHaveProperty('plan');
      expect(member).toHaveProperty('startDate');
      expect(member).toHaveProperty('status');
    });
  });

  describe('getMetrics', () => {
    it('should return metrics with correct calculations', async () => {
      const members = await service.findAll();
      const result = await service.getMetrics();
      
      // Verificar se todos os campos estão presentes
      expect(result).toHaveProperty('totalMembers');
      expect(result).toHaveProperty('activeMembers');
      expect(result).toHaveProperty('premiumMembers');
      expect(result).toHaveProperty('activationRate');
      expect(result).toHaveProperty('premiumRate');
      
      // Verificar se totalMembers corresponde ao total de membros
      expect(result.totalMembers).toBe(members.length);
      
      // Verificar se activeMembers corresponde aos membros ativos
      const activeCount = members.filter(m => m.status === 'Ativo').length;
      expect(result.activeMembers).toBe(activeCount);
      
      // Verificar se premiumMembers corresponde aos membros Premium
      const premiumCount = members.filter(m => m.plan === 'Premium').length;
      expect(result.premiumMembers).toBe(premiumCount);
      
      // Verificar se as taxas são calculadas corretamente
      expect(result.activationRate).toBe((activeCount / members.length) * 100);
      expect(result.premiumRate).toBe((premiumCount / members.length) * 100);
    });
    
    it('should return percentages for rates', async () => {
      const result = await service.getMetrics();
      
      // As taxas devem ser percentuais (0-100)
      expect(result.activationRate).toBeGreaterThanOrEqual(0);
      expect(result.activationRate).toBeLessThanOrEqual(100);
      
      expect(result.premiumRate).toBeGreaterThanOrEqual(0);
      expect(result.premiumRate).toBeLessThanOrEqual(100);
    });
  });
}); 