import HeaderPage from "@/components/HeaderPage";
import OrderCard from "@/components/order/orderCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import Image from "next/image";

const OrderCardData = [
  {
    title: "New Order",
    count: 18,
    icon: "/icons/newOrders.png",
    bgIcon: "bg-blue-200",
  },
  {
    title: "Waitting",
    count: 7,
    icon: "/icons/waitting.png",
    bgIcon: "bg-rose-100",
  },
  {
    title: "On Progress",
    count: 8,
    icon: "/icons/onProgress.png",
    bgIcon: "bg-amber-100",
  },
  {
    title: "Ready for Pickup",
    count: 9,
    icon: "/icons/readyToTake.png",
    bgIcon: "bg-lime-100",
  },
];

const FilterStatusData = [
  {
    id: "new",
    label: "New",
  },
  {
    id: "waitting",
    label: "Waitting",
  },
  {
    id: "onProgress",
    label: "On Progress",
  },
  {
    id: "readyForPickup",
    label: "Ready for Pickup",
  },
];

const Home = () => {
  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Work Monitoring"
        desc="Monitor and track your work progress effectively."
      />
      {/* order card */}
      <div className="flex items-center justify-center gap-3 flex-wrap max-w-full">
        {OrderCardData.map((item) => (
          <Card
            key={item.title}
            className="min-w-[130px] h-[110px] flex-1 py-3 rounded-md justify-between gap-0"
          >
            <CardHeader className="font-medium px-4 gap-0 leading-tight text-base">
              {item.title}
            </CardHeader>
            <CardContent className="flex items-center justify-between px-4">
              <span className="font-medium text-2xl">{item.count}</span>
              <div className={cn("p-2 rounded-full", item.bgIcon)}>
                <Image
                  src={item.icon}
                  alt="icon new order"
                  height={20}
                  width={20}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/*  */}
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <h1 className="font-medium text-base">Order List</h1>
          <Popover>
            <PopoverTrigger>
              <Button
                variant="outline"
                className="text-base font-medium border-none"
              >
                Filters
                <ChevronDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[180px] mr-8">
              <span className="font-medium text-muted-foreground text-sm">
                Order Status
              </span>
              <div className="mt-2 space-y-3">
                {FilterStatusData.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox id={item.id} />
                    <Label htmlFor={item.id}>{item.label}</Label>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <span className="font-medium text-muted-foreground text-sm">
                  Filter By
                </span>
                <RadioGroup className="mt-2">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="recentOrder" id="recentOrder" />
                    <Label htmlFor="recentOrder">Recent Order</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="oldOrder" id="oldOrder" />
                    <Label htmlFor="oldOrder">Old Order</Label>
                  </div>
                </RadioGroup>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="mt-2 flex gap-3">
          {/* list card */}
          <div className="flex items-center justify-between flex-wrap gap-4 max-[650px]:justify-center w-full lg:px-9">
            {Array.from({ length: 4 }).map((_, index) => (
              <OrderCard key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
