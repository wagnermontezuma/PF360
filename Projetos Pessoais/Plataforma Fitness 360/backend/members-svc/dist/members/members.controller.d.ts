import { MembersService } from './members.service';
interface MemberResponse {
    id: number;
    name: string;
    email: string;
    plan: string;
    startDate: string;
    status: string;
}
declare class MetricsResponseDto {
    totalMembers: number;
    activeMembers: number;
    premiumMembers: number;
    activationRate: number;
    premiumRate: number;
}
export declare class MembersController {
    private readonly membersService;
    constructor(membersService: MembersService);
    findAll(): Promise<MemberResponse[]>;
    getMetrics(): Promise<MetricsResponseDto>;
}
export {};
