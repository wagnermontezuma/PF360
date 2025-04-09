import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    register(registerDto: {
        email: string;
        password: string;
        name: string;
    }): Promise<{
        email: string;
        id: string;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfile(req: any): Promise<{
        email: string;
        id: string;
        name: string;
        role: string;
    }>;
}
