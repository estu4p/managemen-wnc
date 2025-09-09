import InvoiceForm from "@/components/form/InvoiceForm";
import HeaderPage from "@/components/HeaderPage";

function AddNewInvoicePage() {
  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Add New Invoice"
        desc="Add detailed invoice data."
        calendar={false}
      />
      <div className="mt-6">
        <InvoiceForm mode="update" />
      </div>
    </div>
  );
}

export default AddNewInvoicePage;
