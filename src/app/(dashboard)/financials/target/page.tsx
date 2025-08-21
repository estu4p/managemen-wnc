import RevenueTargetForm from "@/components/financial/RevenueTargetForm";
import HeaderPage from "@/components/HeaderPage";
import prisma from "@/lib/prisma";

const RevenueTargetPage = async () => {
  const revenueTargets = await prisma.revenueTarget.findMany();

  const revenueTargetsData = revenueTargets.map((target) => ({
    id: target.id,
    category: target.category,
    fromDate: target.fromDate,
    untilDate: target.untilDate,
    totalTarget: Number(target.totalTarget),
  }));

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Revenue Target"
        desc="Manage your revenue target."
        calendar={false}
      />
      <div className="mt-6">
        {!revenueTargets ? (
          <h2>Revenue Target Not found</h2>
        ) : (
          <RevenueTargetForm revenueTargets={revenueTargetsData} />
        )}
      </div>
    </div>
  );
};

export default RevenueTargetPage;
