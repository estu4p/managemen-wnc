/*
  Warnings:

  - The values [PICKER_UP] on the enum `Progress` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `estimatedCompletion` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `untilate` on the `RevenueTarget` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `untilDate` to the `RevenueTarget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Progress_new" AS ENUM ('NEW_ORDER', 'WAITTING', 'ON_PROGRESS', 'FINISHING', 'DONE', 'PICKED_UP', 'CANCELED');
ALTER TABLE "Item" ALTER COLUMN "progress" DROP DEFAULT;
ALTER TABLE "Item" ALTER COLUMN "progress" TYPE "Progress_new" USING ("progress"::text::"Progress_new");
ALTER TYPE "Progress" RENAME TO "Progress_old";
ALTER TYPE "Progress_new" RENAME TO "Progress";
DROP TYPE "Progress_old";
ALTER TABLE "Item" ALTER COLUMN "progress" SET DEFAULT 'NEW_ORDER';
COMMIT;

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "estimatedCompletion",
ADD COLUMN     "progress" TEXT NOT NULL DEFAULT 'NEW_ORDER',
ADD COLUMN     "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW();

-- AlterTable
ALTER TABLE "RevenueTarget" DROP COLUMN "untilate",
ADD COLUMN     "untilDate" TIMESTAMP NOT NULL DEFAULT NOW();
