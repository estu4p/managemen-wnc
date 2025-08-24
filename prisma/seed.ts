import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // 1. User
  for (let i = 1; i <= 5; i++) {
    await prisma.user.create({
      data: {
        id: `user-${i}`,
        username: `user${i}`,
        name: faker.person.fullName(),
        role: i % 2 === 0 ? "ADMIN" : "SUPERADMIN",
      },
    });
  }

  // 2. Customer
  for (let i = 1; i <= 10; i++) {
    await prisma.customer.create({
      data: {
        id: `cust-${i}`,
        name: faker.person.fullName(),
        phone: `08${faker.number.int({ min: 1000000000, max: 9999999999 })}`,
        photo: faker.image.avatar(),
      },
    });
  }

  // 3. Service
  for (let i = 1; i <= 5; i++) {
    await prisma.service.create({
      data: {
        name: `Service ${i}`,
        price: faker.number.float({ min: 10000, max: 50000 }),
      },
    });
  }

  // 4. Discount
  for (let i = 1; i <= 5; i++) {
    await prisma.discount.create({
      data: {
        name: `Discount ${i}`,
        discount: faker.number.float({ min: 5, max: 20 }),
        type: faker.helpers.arrayElement(["PERCENTAGE", "NOMINAL"]) as any,
      },
    });
  }

  // 5. Invoice + Items
  const services = await prisma.service.findMany();
  const customers = await prisma.customer.findMany();
  const discounts = await prisma.discount.findMany();

  for (let i = 1; i <= 15; i++) {
    const randomCustomer =
      customers[Math.floor(Math.random() * customers.length)];
    const randomDiscount = faker.helpers.arrayElement(discounts);

    const invoice = await prisma.invoice.create({
      data: {
        id: `inv-${i}`,
        price: faker.number.float({ min: 50000, max: 200000 }),

        note: faker.lorem.sentence(),
        paymentMethod: faker.helpers.arrayElement([
          "CASH",
          "QRIS",
          "TRANSFER",
          "DEBIT",
          "OTHER",
        ]),
        customerId: randomCustomer.id,
        discounts: randomDiscount
          ? {
              connect: [{ id: randomDiscount.id }],
            }
          : undefined,
      },
    });

    // Tambahkan beberapa item ke invoice
    for (let j = 1; j <= faker.number.int({ min: 1, max: 3 }); j++) {
      const randomService = faker.helpers.arrayElement(services);
      await prisma.item.create({
        data: {
          name: faker.commerce.productName(),
          itemCategory: faker.helpers.arrayElement([
            "SHOE",
            "BAG",
            "HELMET",
            "SANDAL",
            "HAT",
            "WALLET",
            "OTHER",
          ]),
          material: faker.commerce.productMaterial(),
          size: `${faker.number.int({ min: 36, max: 45 })}`,
          color: faker.color.human(),
          photos: [faker.image.urlLoremFlickr({ category: "shoes" })],
          note: faker.lorem.sentence(),
          estimatedCompletion: faker.date.soon({ days: 3 }),
          progress: faker.helpers.arrayElement([
            "NEW_ORDER",
            "WAITTING",
            "ON_PROGRESS",
            "FINISHING",
            "DONE",
          ]),
          service: {
            connect: [{ id: randomService.id }],
          },
          invoiceId: invoice.id,
        },
      });
    }
  }

  // 6. Inventory
  for (let i = 1; i <= 10; i++) {
    await prisma.inventory.create({
      data: {
        name: faker.commerce.productName(),
        category: faker.helpers.arrayElement([
          "EQUIPMENT",
          "MATERIAL",
          "PRODUCT",
          "OTHER",
        ]),
        unit: faker.helpers.arrayElement([
          "PCS",
          "LITER",
          "GRAM",
          "METER",
          "PAIRS",
          "BOX",
          "ROLL",
          "OTHER",
        ]),
        initialStock: faker.number.int({ min: 10, max: 100 }),
        currentStock: faker.number.int({ min: 1, max: 100 }),
        price: faker.number.float({ min: 5000, max: 50000 }),
        photo: faker.image.urlLoremFlickr({ category: "products" }),
      },
    });
  }

  // 7. RevenueTarget
  for (let i = 1; i <= 5; i++) {
    const fromDate = faker.date.past();
    const untilDate = faker.date.future();
    await prisma.revenueTarget.create({
      data: {
        name: `saksake-${i}`,
        category: faker.helpers.arrayElement([
          "DAILY",
          "WEEKLY",
          "MONTHLY",
          "YEARLY",
          "OTHER",
        ]),
        fromDate,
        untilDate: untilDate,
        totalTarget: faker.number.float({ min: 1000000, max: 5000000 }),
      },
    });
  }

  // 8. Transaction
  for (let i = 1; i <= 20; i++) {
    await prisma.transaction.create({
      data: {
        type: faker.helpers.arrayElement(["INCOME", "EXPENSE"]),
        category: faker.helpers.arrayElement([
          "SERVICE_INCOME",
          "PRODUCT_SALES",
          "OTHER_INCOME",
          "MATERIAL_PURCHASE",
          "EQUIPMENT_PURCHASE",
          "SALARY",
          "RENT",
          "UTILITY",
          "MARKETING",
          "OTHER_EXPENSE",
        ]),
        amount: faker.number.float({ min: 5000, max: 2000000 }),
        description: faker.lorem.sentence(),
      },
    });
  }

  // 9. FinancialReport
  for (let i = 1; i <= 5; i++) {
    await prisma.financialReport.create({
      data: {
        period: faker.helpers.arrayElement([
          "DAILY",
          "WEEKLY",
          "MONTHLY",
          "YEARLY",
          "OTHER",
        ]),
        year: faker.number.int({ min: 2020, max: 2025 }),
        month: faker.number.int({ min: 1, max: 12 }),
        week: faker.number.int({ min: 1, max: 52 }),
        totalIncome: faker.number.float({ min: 1000000, max: 5000000 }),

        totalExpense: faker.number.float({ min: 500000, max: 4000000 }),

        totalProfit: faker.number.float({ min: 100000, max: 2000000 }),

        totalItemDone: faker.number.int({ min: 0, max: 50 }),
        totalProductSold: faker.number.int({ min: 0, max: 100 }),
        notes: faker.lorem.sentence(),
      },
    });
  }
}

main()
  .then(() => {
    console.log("✅ Seed data berhasil dibuat!");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
