import UserForm from "@/components/form/UserForm";
import HeaderPage from "@/components/HeaderPage";
import React from "react";

const NewAdminPage = () => {
  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Add New Admin"
        desc="Add new admin data."
        calendar={false}
      />
      <UserForm mode="create" />
    </div>
  );
};

export default NewAdminPage;
