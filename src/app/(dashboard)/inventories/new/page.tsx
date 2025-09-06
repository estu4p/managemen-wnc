import InventoryForm from "@/components/form/InventoryForm";
import HeaderPage from "@/components/HeaderPage";

function AddNewInventoryPage() {
  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Inventory Details"
        desc="Add detailed inventory data."
        calendar={false}
      />
      <InventoryForm mode="create" />
    </div>
  );
}

export default AddNewInventoryPage;
