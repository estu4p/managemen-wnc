import UserForm from "@/components/form/UserForm";
import HeaderPage from "@/components/HeaderPage";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import React from "react";

const SecurityPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  console.log(user?.name);

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Security"
        desc="Manage your acount security settings."
        calendar={false}
      />
      <UserForm mode="update" defaultValues={user ?? undefined} />
    </div>
  );
};

export default SecurityPage;
