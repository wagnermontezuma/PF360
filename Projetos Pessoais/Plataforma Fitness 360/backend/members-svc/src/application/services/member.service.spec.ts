import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemberService } from './member.service';
import { Member } from '../../domain/entities/member.entity';
import { Contract } from '../../domain/entities/contract.entity';
import { KafkaService } from '../../infrastructure/kafka/kafka.service';

describe('MemberService', () => {
  let service: MemberService;
  let memberRepository: Repository<Member>;
  let contractRepository: Repository<Contract>;
  let kafkaService: KafkaService;

  const mockMember = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    cpf: '12345678900',
    phone: '11999999999',
    tenantId: 'tenant-1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: getRepositoryToken(Member),
          useValue: {
            find: jest.fn().mockResolvedValue([mockMember]),
            findOneOrFail: jest.fn().mockResolvedValue(mockMember),
            create: jest.fn().mockReturnValue(mockMember),
            save: jest.fn().mockResolvedValue(mockMember),
          },
        },
        {
          provide: getRepositoryToken(Contract),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: KafkaService,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MemberService>(MemberService);
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    contractRepository = module.get<Repository<Contract>>(getRepositoryToken(Contract));
    kafkaService = module.get<KafkaService>(KafkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of members', async () => {
      const result = await service.findAll('tenant-1');
      expect(result).toEqual([mockMember]);
      expect(memberRepository.find).toHaveBeenCalledWith({
        where: { tenantId: 'tenant-1' },
        relations: ['contracts'],
      });
    });
  });
}); 