import { MetricsResponseDto } from './dto/metrics-response.dto';
export declare class MembersService {
    private readonly members;
    findAll(): Promise<{
        id: number;
        name: string;
        email: string;
        plan: string;
        startDate: string;
        status: string;
    }[]>;
    getMetrics(): Promise<MetricsResponseDto>;
}
