import TransactionForm from "@/components/form/TransactionForm";
import HeaderPage from "@/components/HeaderPage";

function AddNewTransactionPage() {
  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Transaction Details"
        desc="Add detailed transaction data."
        calendar={false}
      />
      {/* <Button size="sm" variant="destructive" className="mb-3">
          Delete
        </Button> */}
      <TransactionForm mode="create" />
    </div>
  );
}

export default AddNewTransactionPage;
