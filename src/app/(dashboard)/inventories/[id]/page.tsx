import HeaderPage from "@/components/HeaderPage";
import DialogDelete from "@/components/form/DialogDelete";
import InventoryForm from "@/components/form/InventoryForm";
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
      <div className="flex justify-between items-end">
        <HeaderPage
          title="Inventory Details"
          desc="Update inventory data."
          calendar={false}
        />
        {/* <Button size="sm" variant="destructive" className="mb-3">
          Delete
        </Button> */}
        <DialogDelete
          table="inventory"
          id={inventoryData.id}
          title={inventoryData.name}
        />
      </div>
      <InventoryForm mode="update" defaultValues={inventoryData} />
    </div>
  );
}

export default InventoryDetailsPage;
