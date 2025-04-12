import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpa o banco de dados
  await prisma.feedback.deleteMany({});

  // Cria feedbacks de teste
  await prisma.feedback.createMany({
    data: [
      {
        userId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
        nota: 5,
        comentario: 'Excelente academia! Ótimos equipamentos e professores muito atenciosos.',
      },
      {
        userId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
        nota: 4,
        comentario: 'Gostei das aulas de funcional, mas os vestiários poderiam ser maiores.',
      },
      {
        userId: '2c7f9ba2-149a-41d7-8a8a-dd5f82e6f4e1',
        nota: 5,
        comentario: 'Adorei o aplicativo! Muito fácil de usar e posso acompanhar bem meu progresso.',
      },
      {
        userId: '3a5b79e1-99c5-4d9f-91a2-53c9e8a4bc12',
        nota: 3,
        comentario: 'A academia é boa, mas às vezes fica muito lotada no final do dia.',
      },
      {
        userId: '4d7e4a2b-3c9f-48a1-b7e6-5f2c8d1e9a3b',
        nota: 4,
        comentario: 'Os treinos personalizados estão sendo muito eficientes. Já perdi 5kg!',
      },
    ],
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