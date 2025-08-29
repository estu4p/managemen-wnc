/*
  Warnings:

  - You are about to drop the column `discount` on the `Discount` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromDate` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `untilDate` to the `Discount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RevenueTargetStatus" AS ENUM ('SUCCESS', 'FAILED', 'PROCESS');

-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "discount",
ADD COLUMN     "amount" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "fromDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "untilDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "RevenueTarget" ADD COLUMN     "status" "RevenueTargetStatus" NOT NULL DEFAULT 'PROCESS',
ALTER COLUMN "category" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
