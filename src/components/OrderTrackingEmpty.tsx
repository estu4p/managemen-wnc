import { ArrowUpRightIcon, FileX } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { Button } from "./ui/button";
import Link from "next/link";

const OrderTrackingEmpty = () => {
  return (
    <Empty className="w-full max-w-md bg-accent">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileX />
        </EmptyMedia>
        <EmptyTitle>Invoice Not Found</EmptyTitle>
      </EmptyHeader>
      <EmptyDescription className="">
        It looks like you don&apos;t have any invoices yet. Start by placing
        your first order to generate one.
      </EmptyDescription>
      <EmptyContent>
        <div className="flex gap-4 items-center">
          <Button>
            <Link href="https://wa.me/6287852916445?text=Hallo%20kak,%20bisa%20order%20sekarang?">
              Order Now
            </Link>
          </Button>
          <Button
            variant="link"
            asChild
            className="text-muted-foreground"
            size="sm"
          >
            <a href="https://wncshoes.com">
              Visit Website <ArrowUpRightIcon />
            </a>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
};

export default OrderTrackingEmpty;
