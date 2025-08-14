-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('SHOE', 'BAG', 'HELMET', 'SANDAL', 'HAT', 'WALLET', 'OTHER');

-- CreateEnum
CREATE TYPE "Progress" AS ENUM ('NEW_ORDER', 'WAITTING', 'ON_PROGRESS', 'FINISHING', 'DONE', 'PICKER_UP', 'CANCELED');

-- CreateEnum
CREATE TYPE "InventoryCategory" AS ENUM ('EQUIPMENT', 'MATERIAL', 'PRODUCT', 'OTHER');

-- CreateEnum
CREATE TYPE "InventoryUnit" AS ENUM ('PSC', 'LITER', 'GRAM', 'METER', 'PAIRS', 'BOX', 'ROLL', 'OTHER');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "CashFlowCategory" AS ENUM ('SERVICE_INCOME', 'PRODUCT_SALES', 'OTHER_INCOME', 'MATERIAL_PURCHASE', 'EQUIPMENT_PURCHASE', 'SALARY', 'RENT', 'UTILITY', 'MARKETING', 'OTHER_EXPENSE');

-- CreateEnum
CREATE TYPE "PeriodCategory" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "itemCategory" "ItemCategory" NOT NULL,
    "material" TEXT,
    "size" TEXT,
    "color" TEXT,
    "photos" JSONB,
    "note" TEXT,
    "estimatedCompletion" TIMESTAMP(3),
    "progress" "Progress" NOT NULL DEFAULT 'NEW_ORDER',
    "serviceId" INTEGER NOT NULL,
    "customerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "addDiscount" DECIMAL(6,2),
    "note" TEXT,
    "estimatedCompletion" TIMESTAMP(3),
    "customerId" TEXT NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "discountId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discount" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "discount" DECIMAL(6,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" "InventoryCategory" NOT NULL,
    "unit" "InventoryUnit" NOT NULL,
    "initialStock" DOUBLE PRECISION NOT NULL,
    "currentStock" DOUBLE PRECISION NOT NULL,
    "price" DECIMAL(10,2),
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueTarget" (
    "id" SERIAL NOT NULL,
    "category" "PeriodCategory" NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "untilate" TIMESTAMP(3) NOT NULL,
    "totalTarget" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RevenueTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "type" "TransactionType" NOT NULL,
    "category" "CashFlowCategory" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialReport" (
    "id" SERIAL NOT NULL,
    "period" "PeriodCategory" NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER,
    "week" INTEGER,
    "totalIncome" DECIMAL(12,2) NOT NULL DEFAULT 0.0,
    "totalExpense" DECIMAL(12,2) NOT NULL DEFAULT 0.0,
    "totalProfit" DECIMAL(12,2) NOT NULL DEFAULT 0.0,
    "totalItemDone" INTEGER NOT NULL DEFAULT 0,
    "totalProductSold" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FinancialReport_period_year_month_week_key" ON "FinancialReport"("period", "year", "month", "week");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "Discount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
