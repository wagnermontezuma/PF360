import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../../domain/entities/member.entity';
import { Contract } from '../../domain/entities/contract.entity';
import { CreateMemberInput, UpdateMemberInput } from '../dto/member.input';
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

  async createMember(input: CreateMemberInput): Promise<Member> {
    const member = this.memberRepository.create({
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      phone: input.phone,
      address: input.address,
      tenantId: input.tenantId,
    });

    const savedMember = await this.memberRepository.save(member);

    await this.kafkaService.emit('member.created', {
      id: savedMember.id,
      email: savedMember.email,
    });

    return savedMember;
  }

  async updateMember(id: string, input: UpdateMemberInput): Promise<Member> {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new Error('Membro não encontrado');
    }

    if (input.name) member.name = input.name;
    if (input.email) member.email = input.email;
    if (input.phone) member.phone = input.phone;
    if (input.address) member.address = input.address;

    return await this.memberRepository.save(member);
  }

  async deleteMember(id: string): Promise<boolean> {
    const result = await this.memberRepository.delete(id);
    return result.affected > 0;
  }

  async getMember(id: string): Promise<Member> {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new Error('Membro não encontrado');
    }
    return member;
  }

  async getAllMembers(): Promise<Member[]> {
    return await this.memberRepository.find();
  }

  async getMemberContracts(memberId: string): Promise<Contract[]> {
    return await this.contractRepository.find({
      where: { member: { id: memberId } },
      relations: ['member'],
    });
  }
} 