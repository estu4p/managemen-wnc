import DialogDelete from "@/components/form/DialogDelete";
import UserForm from "@/components/form/UserForm";
import HeaderPage from "@/components/HeaderPage";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";

async function AdminDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return <h2>User not found</h2>;
  }

  return (
    <div className="p-4 sm:px-7">
      <div className="flex justify-between items-end ">
        <HeaderPage
          title="Admin Details"
          desc="View and manage admin details, including username, status, and password user."
          calendar={false}
        />
        <DialogDelete table="user" id={id} title="User" />
      </div>
      <UserForm mode="update" defaultValues={user} />
    </div>
  );
}

export default AdminDetailPage;
