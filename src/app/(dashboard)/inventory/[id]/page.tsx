import HeaderPage from "@/components/HeaderPage";
import InventoryDetails from "@/components/inventory/InventoryDetails";
import prisma from "@/lib/prisma";

async function InventoryDetailsPage({ params }: { params: { id: string } }) {
  const inventory = await prisma.inventory.findUnique({
    where: { id: Number(params.id) },
  });

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Add New Inventory"
        desc="Add detailed inventory data."
        calendar={false}
      />
      {!inventory ? (
        <h2>Inventory not found</h2>
      ) : (
        <InventoryDetails inventory={inventory} />
      )}
    </div>
  );
}

export default InventoryDetailsPage;
