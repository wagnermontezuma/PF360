"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.user.deleteMany({});
    await prisma.user.create({
        data: {
            email: 'usuario@email.com',
            password: await bcrypt.hash('senha123', 10),
            name: 'Usuário Teste',
            role: 'ADMIN',
        },
    });
    console.log('Dados de exemplo criados com sucesso!');
}
main()
    .catch((e) => {
    console.error('Erro ao criar dados de exemplo:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map