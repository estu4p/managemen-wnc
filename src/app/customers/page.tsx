import HeaderPage from "@/components/HeaderPage";
import React from "react";

import { CustomerRecord, columns } from "./columns";
import { DataTable } from "./dataTable";

async function getData(): Promise<CustomerRecord[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      photo: "https://github.com/shadcn.png",
      name: "John Doe",
      phone: "123-456-7890",
      totalNotes: 5,
      totalItems: 10,
      firstTimeComing: "2023-10-01",
    },
    {
      id: "728ed52f",
      photo: "https://github.com/shadcn.png",
      name: "John Doe",
      phone: "123-456-7890",
      totalNotes: 5,
      totalItems: 10,
      firstTimeComing: "2023-10-01",
    },
    {
      id: "728ed52f",
      photo: "https://github.com/shadcn.png",
      name: "John Doe",
      phone: "123-456-7890",
      totalNotes: 5,
      totalItems: 10,
      firstTimeComing: "2023-10-01",
    },
    // ...
  ];
}

export default async function CustomersPage() {
  const data = await getData();

  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Customer Records"
        desc="Find all customer records, categorized and easy to search."
      />
      <div className="container mx-auto">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
