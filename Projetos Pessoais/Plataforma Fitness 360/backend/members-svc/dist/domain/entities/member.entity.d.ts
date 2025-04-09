import { Contract } from './contract.entity';
export declare class Member {
    id: string;
    name: string;
    email: string;
    cpf: string;
    phone: string;
    address: string;
    tenantId: string;
    contracts: Contract[];
    createdAt: Date;
    updatedAt: Date;
}
