import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpa o banco de dados
  await prisma.payment.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.subscription.deleteMany({});

  // Cria assinaturas de teste
  const subscription1 = await prisma.subscription.create({
    data: {
      memberId: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
      plan: 'Premium',
      price: 99.90,
      status: 'ACTIVE',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2025-01-15'),
    },
  });

  const subscription2 = await prisma.subscription.create({
    data: {
      memberId: '2c7f9ba2-149a-41d7-8a8a-dd5f82e6f4e1',
      plan: 'Basic',
      price: 49.90,
      status: 'ACTIVE',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2025-02-01'),
    },
  });

  const subscription3 = await prisma.subscription.create({
    data: {
      memberId: '3a5b79e1-99c5-4d9f-91a2-53c9e8a4bc12',
      plan: 'Premium',
      price: 99.90,
      status: 'INACTIVE',
      startDate: new Date('2024-01-10'),
      endDate: new Date('2025-01-10'),
    },
  });

  // Cria faturas para as assinaturas
  const invoice1 = await prisma.invoice.create({
    data: {
      subscriptionId: subscription1.id,
      amount: 99.90,
      status: 'PAID',
      dueDate: new Date('2024-02-15'),
      paidDate: new Date('2024-02-12'),
    },
  });

  const invoice2 = await prisma.invoice.create({
    data: {
      subscriptionId: subscription1.id,
      amount: 99.90,
      status: 'PAID',
      dueDate: new Date('2024-03-15'),
      paidDate: new Date('2024-03-10'),
    },
  });

  const invoice3 = await prisma.invoice.create({
    data: {
      subscriptionId: subscription1.id,
      amount: 99.90,
      status: 'PENDING',
      dueDate: new Date('2024-04-15'),
      paidDate: null,
    },
  });

  const invoice4 = await prisma.invoice.create({
    data: {
      subscriptionId: subscription2.id,
      amount: 49.90,
      status: 'PAID',
      dueDate: new Date('2024-03-01'),
      paidDate: new Date('2024-02-28'),
    },
  });

  const invoice5 = await prisma.invoice.create({
    data: {
      subscriptionId: subscription2.id,
      amount: 49.90,
      status: 'PENDING',
      dueDate: new Date('2024-04-01'),
      paidDate: null,
    },
  });

  // Adiciona pagamentos para as faturas pagas
  await prisma.payment.createMany({
    data: [
      {
        subscriptionId: subscription1.id,
        amount: 99.90,
        status: 'COMPLETED',
        paymentMethod: 'CREDIT_CARD',
        paymentDate: new Date('2024-02-12'),
      },
      {
        subscriptionId: subscription1.id,
        amount: 99.90,
        status: 'COMPLETED',
        paymentMethod: 'CREDIT_CARD',
        paymentDate: new Date('2024-03-10'),
      },
      {
        subscriptionId: subscription2.id,
        amount: 49.90,
        status: 'COMPLETED',
        paymentMethod: 'PIX',
        paymentDate: new Date('2024-02-28'),
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