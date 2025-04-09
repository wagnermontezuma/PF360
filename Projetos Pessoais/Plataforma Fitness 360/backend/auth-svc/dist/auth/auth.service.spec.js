"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const jwt_1 = require("@nestjs/jwt");
const auth_service_1 = require("./auth.service");
const common_1 = require("@nestjs/common");
describe('AuthService', () => {
    let service;
    let jwtService;
    const mockJwtService = {
        sign: jest.fn(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: jwt_1.JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
        jwtService = module.get(jwt_1.JwtService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('validateUser', () => {
        it('should return user object when credentials are valid', async () => {
            const result = await service.validateUser('aluno@exemplo.com', 'senha123');
            expect(result).toEqual({
                id: expect.any(Number),
                email: 'aluno@exemplo.com',
                name: expect.any(String),
            });
        });
        it('should throw UnauthorizedException when credentials are invalid', async () => {
            await expect(service.validateUser('invalid@email.com', 'wrongpass')).rejects.toThrow(common_1.UnauthorizedException);
        });
    });
    describe('login', () => {
        it('should return access token when login is successful', async () => {
            const user = {
                id: 1,
                email: 'aluno@exemplo.com',
                name: 'Aluno Teste',
            };
            mockJwtService.sign.mockReturnValue('mock.jwt.token');
            const result = await service.login(user);
            expect(result).toEqual({
                access_token: 'mock.jwt.token',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            });
            expect(jwtService.sign).toHaveBeenCalledWith({
                sub: user.id,
                email: user.email,
            });
        });
    });
});
//# sourceMappingURL=auth.service.spec.js.map