import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    generateTokens(userId: number, email: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    validateRefreshToken(token: string): Promise<any>;
    validateUser(email: string, password: string): Promise<any>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    validateToken(token: string): Promise<any>;
    getProfile(userId: string): Promise<{
        email: string;
        id: string;
        name: string;
        role: string;
    }>;
    register(email: string, password: string, name: string): Promise<{
        email: string;
        id: string;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
