import TransactionDetails from "@/components/form/TransactionForm";
import HeaderPage from "@/components/HeaderPage";
import { serialize } from "@/lib/format";
import prisma from "@/lib/prisma";

async function TransactionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transaction = await prisma.transaction.findUnique({
    where: { id: parseInt(id) },
  });

  if (!transaction) {
    return <h2>Transaction not found</h2>;
  }

  const transactionData = serialize(transaction);

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Transaction Details"
        desc="View and manage detailed transaction information."
        calendar={false}
      />
      {/* <InventoryDetails inventory={inventoryData} /> */}
      <TransactionDetails transaction={transactionData} />
    </div>
  );
}

export default TransactionDetailsPage;
