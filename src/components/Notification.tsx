"use client";

import Link from "next/link";
import { Popover, PopoverTrigger } from "./ui/popover";
import { AlertCircle, Bell } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { Badge } from "./ui/badge";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";
import { useState } from "react";

const NotificationCategories = [
  {
    id: "ALL",
    label: "All",
  },
  {
    id: "INVOICE",
    label: "Invoice",
  },
  {
    id: "FINANCIAL",
    label: "Financial",
  },
  {
    id: "INVENTORY",
    label: "Inventory",
  },
  {
    id: "TRANSACTION",
    label: "Transaction",
  },
  {
    id: "OTHER",
    label: "Other",
  },
];

type NotificationProps = {
  id: string;
  title: string;
  category: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

const Notification = ({ data }: { data: NotificationProps[] }) => {
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const filteredData =
    selectedCategory === "ALL"
      ? data
      : data.filter((d) => d.category === selectedCategory);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Link
          href="#"
          className="p-1.5 text-sm bg-gray-100 font-medium border border-gray-100 rounded-full flex items-center hover:bg-accent hover:text-accent-foreground transition-all hover:border-gray-300"
        >
          <Bell strokeWidth={1} className="w-5 h-5" />
        </Link>
      </PopoverTrigger>
      <PopoverContent className="max-sm:max-w-[350px] max-w-[430px] bg-gray-100 border rounded-md py-2 px-4 md:mr-40 mt-1.5">
        <h4 className="text-base font-medium">Notifications</h4>
        <div className="mt-2">
          <div className="space-x-2 overflow-x-scroll whitespace-nowrap">
            <ToggleGroup
              type="single"
              asChild
              defaultValue="ALL"
              onValueChange={(val) => val && setSelectedCategory(val)}
            >
              {NotificationCategories.map((category, index) => (
                <ToggleGroupItem
                  key={index}
                  value={category.id}
                  className="rounded-md h-5.5 text-sm hover:bg-secondary-green/80 data-[state=on]:bg-secondary-green data-[state=on]:text-black cursor-pointer"
                >
                  <Badge
                    variant="outline"
                    className={`hover:border-none ${
                      selectedCategory === category.id ? "border-none" : ""
                    }`}
                  >
                    {category.label}
                  </Badge>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="mt-4 text-sm space-y-1">
            {filteredData.length > 0 ? (
              filteredData.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex gap-2 items-start rounded-sm py-1 px-2  ${
                    !notif.isRead ? "bg-primary-gray" : ""
                  }`}
                >
                  <div className="">
                    <AlertCircle className="fill-destructive text-white" />
                  </div>
                  <div className="w-full">
                    <h5 className="font-medium capitalize">{notif.category}</h5>
                    <h6
                      className="text-muted-foreground"
                      dangerouslySetInnerHTML={{
                        __html: notif.message,
                      }}
                    >
                      {/* <span className="font-medium text-foreground">Sabun Detoxy</span>tinggal<span className="font-medium text-foreground">5ml</span>,harap segera beli ya! nanti ndak kehabisan lagi. wkwkk */}
                    </h6>
                    <span className="text-muted-foreground block">20h Ago</span>
                    {!notif.isRead && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-normal h-7 px-2 mt-1 cursor-pointer"
                      >
                        Okay
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <h2 className="text-center">Notification not found</h2>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
