/*
  Warnings:

  - You are about to drop the column `name` on the `Discount` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `RevenueTarget` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `title` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `RevenueTarget` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdAt` on table `Service` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `title` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('INVOICE', 'FINANCIAL', 'INVENTORY', 'TRANSACTION', 'OTHER');

-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RevenueTarget" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "description",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "category" "NotificationCategory" NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
