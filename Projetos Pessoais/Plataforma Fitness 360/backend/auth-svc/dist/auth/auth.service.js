"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async generateTokens(userId, email) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, email }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN'),
            }),
            this.jwtService.signAsync({ sub: userId, email }, {
                secret: this.configService.get('REFRESH_TOKEN_SECRET'),
                expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async refreshAccessToken(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('REFRESH_TOKEN_SECRET'),
            });
            const newAccessToken = await this.jwtService.signAsync({ sub: payload.sub, email: payload.email }, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN'),
            });
            return { accessToken: newAccessToken };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Refresh token inválido');
        }
    }
    async validateRefreshToken(token) {
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: this.configService.get('REFRESH_TOKEN_SECRET'),
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token inválido ou expirado');
        }
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                role: true,
            }
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const { password: _, ...result } = user;
        return result;
    }
    async login(email, password) {
        const user = await this.validateUser(email, password);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const access_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_SECRET') || 'sua_chave_secreta',
            expiresIn: '1d',
        });
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
    async validateToken(token) {
        try {
            return await this.jwtService.verifyAsync(token);
        }
        catch {
            throw new common_1.UnauthorizedException('Token inválido');
        }
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Usuário não encontrado');
        }
        return user;
    }
    async register(email, password, name) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.UnauthorizedException('Email já cadastrado');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'USER'
            },
        });
        const { password: _, ...result } = user;
        return result;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map