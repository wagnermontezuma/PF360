import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpa o banco de dados
  await prisma.progress.deleteMany({});
  await prisma.workout.deleteMany({});
  await prisma.member.deleteMany({});

  // Cria membros de teste
  const member1 = await prisma.member.create({
    data: {
      userId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      name: 'João Silva',
      email: 'joao@exemplo.com',
      phone: '(11) 98765-4321',
      birthDate: new Date('1990-05-15'),
      height: 1.78,
      weight: 75.5,
      goals: ['Perder peso', 'Ganhar massa muscular'],
    },
  });

  const member2 = await prisma.member.create({
    data: {
      userId: '2c7f9ba2-149a-41d7-8a8a-dd5f82e6f4e1',
      name: 'Maria Oliveira',
      email: 'maria@exemplo.com',
      phone: '(11) 98888-7777',
      birthDate: new Date('1988-08-23'),
      height: 1.65,
      weight: 62.0,
      goals: ['Melhorar condicionamento', 'Fortalecimento'],
    },
  });

  const member3 = await prisma.member.create({
    data: {
      userId: '3a5b79e1-99c5-4d9f-91a2-53c9e8a4bc12',
      name: 'Carlos Pereira',
      email: 'carlos@exemplo.com',
      phone: '(11) 99999-6666',
      birthDate: new Date('1985-03-10'),
      height: 1.82,
      weight: 88.2,
      goals: ['Hipertrofia', 'Perder gordura'],
    },
  });

  // Adiciona treinos para os membros
  await prisma.workout.createMany({
    data: [
      {
        memberId: member1.id,
        name: 'Treino A - Superior',
        description: 'Foco em peito, ombros e tríceps',
        duration: 60,
        calories: 450,
        date: new Date('2024-04-01'),
      },
      {
        memberId: member1.id,
        name: 'Treino B - Inferior',
        description: 'Foco em quadríceps, posterior e panturrilha',
        duration: 55,
        calories: 500,
        date: new Date('2024-04-03'),
      },
      {
        memberId: member2.id,
        name: 'Treino Funcional',
        description: 'Circuito de exercícios funcionais',
        duration: 45,
        calories: 380,
        date: new Date('2024-04-02'),
      },
    ],
  });

  // Adiciona progresso para os membros
  await prisma.progress.createMany({
    data: [
      {
        memberId: member1.id,
        weight: 75.5,
        date: new Date('2024-03-01'),
        notes: 'Início do acompanhamento',
      },
      {
        memberId: member1.id,
        weight: 74.8,
        date: new Date('2024-03-15'),
        notes: 'Redução de peso conforme esperado',
      },
      {
        memberId: member1.id,
        weight: 73.9,
        date: new Date('2024-04-01'),
        notes: 'Continua progredindo bem',
      },
      {
        memberId: member2.id,
        weight: 62.0,
        date: new Date('2024-03-01'),
        notes: 'Início do acompanhamento',
      },
      {
        memberId: member2.id,
        weight: 62.3,
        date: new Date('2024-03-15'),
        notes: 'Pequeno aumento devido ao ganho muscular',
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