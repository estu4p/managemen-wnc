import DialogDelete from "@/components/form/DialogDelete";
import TransactionForm from "@/components/form/TransactionForm";
import HeaderPage from "@/components/HeaderPage";
import { Button } from "@/components/ui/button";
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
      <div className="flex justify-between items-end">
        <HeaderPage
          title="Transaction Details"
          desc="Update transaction data."
          calendar={false}
        />
        {/* <Button size="sm" variant="destructive" className="mb-3">
          Delete
        </Button> */}
        <DialogDelete
          table="transaction"
          id={transaction.id}
          title={transaction.title}
        />
      </div>
      <TransactionForm mode="update" defaultValues={transactionData} />
    </div>
  );
}

export default TransactionDetailsPage;
