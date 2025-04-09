import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Limpa o banco de dados
  await prisma.user.deleteMany({});

  // Cria usuário de teste
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