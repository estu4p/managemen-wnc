import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Link from "next/link";

const OrderCard = () => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 max-[650px]:justify-center w-full lg:px-9">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="max-w-[290px] flex- h-fit rounded-md ">
          <CardHeader className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="size-9">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>ES</AvatarFallback>
              </Avatar>
              <div className="">
                <CardTitle>Reza Pramudya</CardTitle>
                <CardDescription className="text-[13px]">
                  12:30 PM
                </CardDescription>
              </div>
            </div>
            <span className="py-0.5 px-3 rounded-xl bg-blue-200 font-medium text-blue-400">
              New
            </span>
          </CardHeader>
          <CardContent className="px-">
            <div className="flex items-center justify-between w-[94%]">
              <div>
                <h3 className="font-medium text-muted-foreground">Order ID</h3>
                <span className="font-medium">WNC-250539</span>
              </div>
              <div>
                <h3 className="font-medium text-muted-foreground">
                  Total Payment
                </h3>
                <span className="font-medium">Rp. 240,000</span>
              </div>
            </div>
            {/*  */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="size-9">
                  <AvatarImage />
                  <AvatarFallback>HL</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium capitalize">Adidas samba</h3>
                  <p className="text-muted-foreground -mt-1">Deep Clean</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="size-9">
                  <AvatarImage />
                  <AvatarFallback>GG</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium capitalize">Nike Air</h3>
                  <p className="text-muted-foreground -mt-1">Regular Clean</p>
                </div>
              </div>
            </div>
            <div className="w-full flex items-end justify-end p-0">
              <Button
                className="text-muted-foreground hover:bg-background p-0"
                variant="ghost"
                size="noPadding"
              >
                +2 more items
              </Button>
            </div>
            <div className="mt-4 px">
              <span className="font-medium text-muted-foreground">
                Order Notes
              </span>
              <p className="text-wrap leading-tight">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/order/details" className="w-full">
              <Button className="bg-primary-green w-full">Order details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default OrderCard;
