// prisma/seed.ts
import {
  PrismaClient,
  UserRole,
  ItemCategory,
  Progress,
  InventoryCategory,
  InventoryUnit,
  TransactionType,
  CashFlowCategory,
  PeriodCategory,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // USERS
  await prisma.user.createMany({
    data: Array.from({ length: 3 }).map((_, i) => ({
      id: `user-${i}`,
      username: faker.internet.userName(),
      name: faker.person.fullName(),
      role: i === 0 ? UserRole.SUPERADMIN : UserRole.ADMIN,
    })),
  });

  // CUSTOMERS
  await prisma.customer.createMany({
    data: Array.from({ length: 10 }).map((_, i) => ({
      id: `cust-${i}`,
      name: faker.person.fullName(),
      phone: `08${faker.number.int({ min: 1000000000, max: 9999999999 })}`,
      photo: faker.image.avatar(),
    })),
  });

  // SERVICES
  await prisma.service.createMany({
    data: Array.from({ length: 5 }).map(() => ({
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price({ min: 10000, max: 100000 })),
    })),
  });

  // DISCOUNTS
  await prisma.discount.createMany({
    data: Array.from({ length: 5 }).map(() => ({
      name: faker.word.words(2),
      discount: parseFloat(faker.finance.amount({ min: 5, max: 20, dec: 2 })),
    })),
  });

  // INVENTORY
  await prisma.inventory.createMany({
    data: Array.from({ length: 10 }).map(() => ({
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement(Object.values(InventoryCategory)),
      unit: faker.helpers.arrayElement(Object.values(InventoryUnit)),
      initialStock: faker.number.float({ min: 10, max: 100 }),
      currentStock: faker.number.float({ min: 1, max: 100 }),
      price: parseFloat(faker.commerce.price({ min: 5000, max: 50000 })),
      photo: faker.image.url(),
    })),
  });

  // REVENUE TARGET
  await prisma.revenueTarget.createMany({
    data: Array.from({ length: 3 }).map(() => ({
      category: PeriodCategory.MONTHLY,
      fromDate: faker.date.past(),
      untilate: faker.date.future(),
      totalTarget: parseFloat(
        faker.commerce.price({ min: 1000000, max: 10000000 })
      ),
    })),
  });

  // TRANSACTIONS
  await prisma.transaction.createMany({
    data: Array.from({ length: 10 }).map(() => ({
      type: faker.helpers.arrayElement(Object.values(TransactionType)),
      category: faker.helpers.arrayElement(Object.values(CashFlowCategory)),
      amount: parseFloat(faker.commerce.price({ min: 10000, max: 200000 })),
      description: faker.lorem.sentence(),
    })),
  });

  // FINANCIAL REPORTS
  await prisma.financialReport.createMany({
    data: Array.from({ length: 5 }).map(() => ({
      period: PeriodCategory.MONTHLY,
      year: faker.date.past().getFullYear(),
      month: faker.number.int({ min: 1, max: 12 }),
      week: faker.number.int({ min: 1, max: 4 }),
      totalIncome: parseFloat(
        faker.commerce.price({ min: 1000000, max: 5000000 })
      ),
      totalExpense: parseFloat(
        faker.commerce.price({ min: 500000, max: 4000000 })
      ),
      totalProfit: parseFloat(
        faker.commerce.price({ min: 100000, max: 2000000 })
      ),
      totalItemDone: faker.number.int({ min: 10, max: 100 }),
      totalProductSold: faker.number.int({ min: 1, max: 50 }),
      notes: faker.lorem.sentence(),
    })),
  });

  // Ambil customer, service, discount yang sudah dibuat
  const customers = await prisma.customer.findMany();
  const services = await prisma.service.findMany();
  const discounts = await prisma.discount.findMany();

  // Buat Invoice + Item
  for (let i = 0; i < 10; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const discount = faker.helpers.arrayElement([...discounts, null]); // bisa null

    const invoice = await prisma.invoice.create({
      data: {
        id: `inv-${i}`,
        price: 0, // nanti diupdate setelah item masuk
        addDiscount: discount
          ? parseFloat(faker.number.float({ min: 1, max: 10 }).toFixed(2))
          : undefined,
        note: faker.lorem.sentence(),
        estimatedCompletion: faker.date.future(),
        customerId: customer.id,
        discountId: discount?.id,
      },
    });

    // Setiap invoice memiliki 1-5 item
    const itemCount = faker.number.int({ min: 1, max: 5 });
    let totalPrice = 0;

    for (let j = 0; j < itemCount; j++) {
      const service = faker.helpers.arrayElement(services);
      totalPrice += Number(service.price);

      await prisma.item.create({
        data: {
          name: faker.commerce.productName(),
          itemCategory: faker.helpers.arrayElement(Object.values(ItemCategory)),
          material: faker.commerce.productMaterial(),
          size: faker.helpers.arrayElement([
            "36",
            "37",
            "38",
            "39",
            "40",
            "41",
            "42",
          ]),
          color: faker.color.human(),
          photos: JSON.stringify([faker.image.url(), faker.image.url()]),
          note: faker.lorem.sentence(),
          estimatedCompletion: faker.date.future(),
          progress: faker.helpers.arrayElement(Object.values(Progress)),
          serviceId: service.id,
          invoiceId: invoice.id,
        },
      });
    }

    // Update total price invoice setelah item ditambahkan
    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        price: totalPrice,
      },
    });
  }
}

main()
  .then(() => {
    console.log("🌱 Seed berhasil");
  })
  .catch((e) => {
    console.error("❌ Seed gagal", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
