/*
  Warnings:

  - You are about to drop the column `discountId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `serviceId` on the `Item` table. All the data in the column will be lost.
  - Added the required column `type` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `RevenueTarget` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'NOMINAL');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'QRIS', 'TRANSFER', 'DEBIT', 'OTHER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID');

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_discountId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_serviceId_fkey";

-- AlterTable
ALTER TABLE "Discount" ADD COLUMN     "type" "DiscountType" NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "discountId",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "serviceId";

-- AlterTable
ALTER TABLE "RevenueTarget" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_ItemToService" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ItemToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DiscountToInvoice" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DiscountToInvoice_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ItemToService_B_index" ON "_ItemToService"("B");

-- CreateIndex
CREATE INDEX "_DiscountToInvoice_B_index" ON "_DiscountToInvoice"("B");

-- AddForeignKey
ALTER TABLE "_ItemToService" ADD CONSTRAINT "_ItemToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToService" ADD CONSTRAINT "_ItemToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountToInvoice" ADD CONSTRAINT "_DiscountToInvoice_A_fkey" FOREIGN KEY ("A") REFERENCES "Discount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountToInvoice" ADD CONSTRAINT "_DiscountToInvoice_B_fkey" FOREIGN KEY ("B") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
