import { Repository } from 'typeorm';
import { Member } from '../../domain/entities/member.entity';
import { Contract } from '../../domain/entities/contract.entity';
import { CreateMemberInput, UpdateMemberInput } from '../dto/member.input';
import { KafkaService } from '../../infrastructure/kafka/kafka.service';
export declare class MemberService {
    private readonly memberRepository;
    private readonly contractRepository;
    private readonly kafkaService;
    constructor(memberRepository: Repository<Member>, contractRepository: Repository<Contract>, kafkaService: KafkaService);
    createMember(input: CreateMemberInput): Promise<Member>;
    updateMember(id: string, input: UpdateMemberInput): Promise<Member>;
    deleteMember(id: string): Promise<boolean>;
    getMember(id: string): Promise<Member>;
    getAllMembers(): Promise<Member[]>;
    getMemberContracts(memberId: string): Promise<Contract[]>;
}
