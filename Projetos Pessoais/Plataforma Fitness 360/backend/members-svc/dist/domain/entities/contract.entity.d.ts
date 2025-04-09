import { Member } from './member.entity';
export declare class Contract {
    id: string;
    planType: string;
    startDate: Date;
    endDate: Date;
    value: number;
    status: string;
    member: Member;
    tenantId: string;
    createdAt: Date;
    updatedAt: Date;
}
