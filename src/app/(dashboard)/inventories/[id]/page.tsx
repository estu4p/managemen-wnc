import HeaderPage from "@/components/HeaderPage";
import InventoryDetails from "@/components/inventory/InventoryForm";
import { serialize } from "@/lib/format";
import prisma from "@/lib/prisma";

async function InventoryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inventory = await prisma.inventory.findUnique({
    where: { id: parseInt(id) },
  });

  if (!inventory) {
    return <h2>Inventory not found</h2>;
  }

  const inventoryData = serialize(inventory);

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Add New Inventory"
        desc="Add detailed inventory data."
        calendar={false}
      />
      <InventoryDetails inventory={inventoryData} />
    </div>
  );
}

export default InventoryDetailsPage;
