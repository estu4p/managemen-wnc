-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "paymentMethod" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "invoiceId" TEXT;
