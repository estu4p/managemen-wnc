"use client";

import { useActionState, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Trash2 } from "lucide-react";
import {
  deleteDiscount,
  deleteRevenueTarget,
  deleteService,
} from "@/lib/action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const deleteActionMap = {
  service: deleteService,
  discount: deleteDiscount,
  target: deleteRevenueTarget,
};

type DialogDeleteProps = {
  table: "service" | "discount" | "target";
  title?: string;
  id?: number | string;
};

const DialogDelete = ({ table, id, title }: DialogDeleteProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [state, formAction] = useActionState(deleteActionMap[table], {
    success: false,
    error: false,
  });

  const router = useRouter();

  useEffect(() => {
    toast(`${title} has been deleted!`);
    setDialogOpen(false);
    setTimeout(() => {
      router.refresh();
    }, 300);
  }, [state, router]);

  return (
    <Dialog>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="iconXs"
            variant="destructive"
            className="cursor-pointer"
          >
            <Trash2 />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete {table}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this data? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <form action={formAction} className="space-y-4">
            <input hidden name="id" defaultValue={id} />
            <span className="font-semibold">
              Are you sure you want to delete this {title}?
            </span>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default DialogDelete;
