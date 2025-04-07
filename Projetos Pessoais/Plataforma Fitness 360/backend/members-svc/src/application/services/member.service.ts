import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../../domain/entities/member.entity';
import { Contract } from '../../domain/entities/contract.entity';
import { CreateMemberInput, UpdateMemberInput, CreateContractInput } from '../dto/member.input';
import { KafkaService } from '../../infrastructure/kafka/kafka.service';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    private readonly kafkaService: KafkaService,
  ) {}

  async findAll(tenantId: string): Promise<Member[]> {
    return this.memberRepository.find({
      where: { tenantId },
      relations: ['contracts'],
    });
  }

  async findOne(id: string, tenantId: string): Promise<Member> {
    return this.memberRepository.findOne({
      where: { id, tenantId },
      relations: ['contracts'],
    });
  }

  async createMember(input: CreateMemberInput, tenantId: string): Promise<Member> {
    const member = this.memberRepository.create({ ...input, tenantId });
    const savedMember = await this.memberRepository.save(member);

    await this.kafkaService.emit('member.created', {
      id: savedMember.id,
      name: savedMember.name,
      email: savedMember.email,
      tenantId: savedMember.tenantId,
    });

    return savedMember;
  }

  async createContract(input: CreateContractInput, tenantId: string): Promise<Contract> {
    const member = await this.memberRepository.findOne({
      where: { id: input.memberId, tenantId },
    });

    if (!member) {
      throw new Error('Member not found');
    }

    const contract = this.contractRepository.create({
      ...input,
      member,
      tenantId,
    });

    const savedContract = await this.contractRepository.save(contract);

    await this.kafkaService.emit('contract.created', {
      id: savedContract.id,
      memberId: member.id,
      planType: savedContract.planType,
      value: savedContract.value,
      startDate: savedContract.startDate,
      endDate: savedContract.endDate,
      tenantId: savedContract.tenantId,
    });

    return savedContract;
  }

  async updateMember(id: string, input: UpdateMemberInput): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { id },
    });

    if (!member) {
      throw new Error('Member not found');
    }

    Object.assign(member, input);
    return this.memberRepository.save(member);
  }

  async deleteMember(id: string): Promise<boolean> {
    const result = await this.memberRepository.delete(id);
    return result.affected > 0;
  }

  async getMemberContracts(memberId: string): Promise<Contract[]> {
    return this.contractRepository.find({
      where: { member: { id: memberId } },
      order: { startDate: 'DESC' },
    });
  }
} 