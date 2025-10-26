import { DataList } from "@/components/DataList";
import HeaderPage from "@/components/HeaderPage";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function ManageAdminPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { page, search } = searchParams;
  const p = page ? parseInt(page) : 1;
  const searchQuery = search || "";
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const whereClause = {
    NOT: {
      id: userId,
    },
    ...(searchQuery
      ? {
          OR: [
            {
              name: {
                contains: searchQuery,
                mode: "insensitive" as const,
              },
            },
            {
              username: {
                contains: searchQuery,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const [data, count] = await prisma.$transaction([
    prisma.user.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.user.count({
      where: whereClause,
    }),
  ]);

  const userData = data.map((user) => ({
    id: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  }));

  return (
    <div className="p-4 sm:px-7">
      <div className="flex items-end justify-between">
        <HeaderPage title="Manage Admin" desc="" calendar={false} />
        <Link href="/user-management/new" className="mb-3">
          <Button variant="default" size="sm" className="cursor-pointer">
            <Plus />
            Add User
          </Button>
        </Link>
      </div>
      <DataList
        data={userData}
        columns={columns}
        page={p}
        count={count}
        searchPlaceholder="Search by name or username..."
        searchKey="search"
        externalSearch={searchQuery}
      />
    </div>
  );
}

export default ManageAdminPage;
