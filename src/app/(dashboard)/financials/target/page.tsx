import { DataTable } from "@/components/DataTable";
import RevenueTargetForm from "@/components/form/RevenueTargetForm";
import HeaderPage from "@/components/HeaderPage";
import prisma from "@/lib/prisma";
import { Columns } from "./columns";

const RevenueTargetPage = async () => {
  const revenueTargets = await prisma.revenueTarget.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const revenueTargetData = revenueTargets.map((target) => ({
    id: target.id,
    title: target.title,
    category: target.category,
    fromDate: target.fromDate,
    untilDate: target.untilDate,
    totalTarget: Number(target.totalTarget),
    status: target.status,
  }));

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Revenue Target"
        desc="Manage your revenue target."
        calendar={false}
      />
      <div className="container mx-auto mt-4">
        <DataTable columns={Columns} data={revenueTargetData} />
        <div className="mt-3">
          <RevenueTargetForm mode="create" />
        </div>
      </div>
    </div>
  );
};

export default RevenueTargetPage;
