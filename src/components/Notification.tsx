import Link from "next/link";
import { Popover, PopoverTrigger } from "./ui/popover";
import { AlertCircle, Bell } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { Badge } from "./ui/badge";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";

const NotificationCategories = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "invoice",
    label: "Invoice",
  },
  {
    id: "financial",
    label: "Financial",
  },
  {
    id: "inventory",
    label: "Inventory",
  },
  {
    id: "transaction",
    label: "Transaction",
  },
  {
    id: "other",
    label: "Other",
  },
];

const Notification = () => {
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
      <PopoverContent className="max-sm:max-w-[350px] max-w-[430px] bg-gray-50 border rounded-md py-2 px-4 md:mr-40 mt-1.5">
        <h4 className="text-base font-medium">Notifications</h4>
        <div className="mt-2">
          <div className="space-x-2 overflow-x-scroll whitespace-nowrap">
            <ToggleGroup type="single" asChild defaultValue="all">
              {NotificationCategories.map((category, index) => (
                <ToggleGroupItem
                  key={index}
                  value={category.id}
                  className="rounded-md h-5.5 text-sm px-2 hover:bg-secondary-green/80 data-[state=on]:bg-secondary-green data-[state=on]:text-black"
                  asChild
                  defaultChecked={category.id === "all"}
                >
                  <Badge variant="outline">{category.label}</Badge>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="mt-4 text-sm space-y-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className={`flex gap-2 items-start rounded-sm py-1 px-2 ${
                  index === 1 ? "bg-primary-gray/80" : ""
                }`}
              >
                <div className="">
                  <AlertCircle className="fill-destructive text-white" />
                </div>
                <div className="w-full">
                  <h5 className="font-medium">Inventory</h5>
                  <h6 className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Sabun Detoxy
                    </span>{" "}
                    tinggal{" "}
                    <span className="font-medium text-foreground">5ml</span>,
                    harap segera beli ya! nanti ndak kehabisan lagi. wkwkk
                  </h6>
                  <span className="text-muted-foreground block">20h Ago</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-normal h-7 px-2 mt-1 cursor-pointer"
                  >
                    Okay
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
