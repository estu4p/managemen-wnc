import RevenueTargetForm from "@/components/form/RevenueTargetForm";
import HeaderPage from "@/components/HeaderPage";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatRupiah } from "@/lib/format";
import prisma from "@/lib/prisma";
import {
  CheckCircle,
  CircleCheck,
  CircleX,
  Timer,
  XCircle,
} from "lucide-react";

const RevenueTargetPage = async () => {
  const revenueTargets = await prisma.revenueTarget.findMany();

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Revenue Target"
        desc="Manage your revenue target."
        calendar={false}
      />
      <div className="container mx-auto mt-4">
        <div className=" rounded-md border h-fit">
          <Table>
            <TableHeader className="bg-primary-gray">
              <TableRow>
                <TableHead className="text-primary">No</TableHead>
                <TableHead className="text-primary">Name</TableHead>
                <TableHead className="text-primary">Category</TableHead>
                <TableHead className="text-primary">Total Target</TableHead>
                <TableHead className="text-primary w-[12%]">Status</TableHead>
                <TableHead className="text-primary">From date</TableHead>
                <TableHead className="text-primary">Until Date</TableHead>
                <TableHead className="text-primary w-[0px] text-end">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {revenueTargets.map((target: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{target.name}</TableCell>
                  <TableCell>{target.category}</TableCell>
                  <TableCell>{formatRupiah(target.totalTarget)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 py-1">
                      <Progress value={80} className="h-1.5 flex-1" />
                      {target.status === "PROCESS" && (
                        <Timer className="text-secondary-green w-5 h-5" />
                      )}
                      {target.status === "SUCCESS" && (
                        <CheckCircle className="text-green-500 w-5 h-5" />
                      )}
                      {target.status === "FAILED" && (
                        <XCircle className="text-red-500 w-5 h-5" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(target.fromDate)}</TableCell>
                  <TableCell>{formatDate(target.untilDate)}</TableCell>
                  <TableCell className="text-right w-fit space-x-1.5 flex">
                    <RevenueTargetForm
                      mode="edit"
                      defaultValues={{
                        name: target.name,
                        category: target.category,
                        totalTarget: Number(target.totalTarget),
                        fromDate: target.fromDate,
                        untilDate: target.untilDate,
                      }}
                    />
                    <RevenueTargetForm
                      mode="delete"
                      defaultValues={{ name: target.name }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-3">
          <RevenueTargetForm mode="create" />
        </div>
      </div>
    </div>
  );
};

export default RevenueTargetPage;
