/*
  Warnings:

  - The values [PSC] on the enum `InventoryUnit` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InventoryUnit_new" AS ENUM ('PCS', 'LITER', 'GRAM', 'METER', 'PAIRS', 'BOX', 'ROLL', 'OTHER');
ALTER TABLE "Inventory" ALTER COLUMN "unit" TYPE "InventoryUnit_new" USING ("unit"::text::"InventoryUnit_new");
ALTER TYPE "InventoryUnit" RENAME TO "InventoryUnit_old";
ALTER TYPE "InventoryUnit_new" RENAME TO "InventoryUnit";
DROP TYPE "InventoryUnit_old";
COMMIT;
