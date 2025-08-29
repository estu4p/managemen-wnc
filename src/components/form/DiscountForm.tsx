"use client";

import { Plus, SquarePen, Trash2 } from "lucide-react";
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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { formatDate, formatDateForInput } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type DiscountFormProps = {
  mode: "create" | "edit" | "delete";
  defaultValues?: {
    name?: string;
    amount?: number;
    type?: string;
    date?: Date;
  };
};

const DiscountForm = ({ mode, defaultValues }: DiscountFormProps) => {
  const title =
    mode === "create"
      ? "Add Discount"
      : mode === "edit"
      ? "Edit Discount"
      : "Delete Discount";

  const desc =
    mode === "create"
      ? "Create a new discount by filling in the details below."
      : mode === "edit"
      ? "Change the discount here. Click save when finished."
      : "Are you sure you want to delete this discount? This action cannot be undone.";

  const icon =
    mode === "create" ? (
      <>
        <Plus /> Add Discount
      </>
    ) : mode === "edit" ? (
      <SquarePen />
    ) : (
      <Trash2 />
    );

  return (
    <Dialog>
      <form action="">
        <DialogTrigger asChild>
          <Button
            size={mode === "create" ? "sm" : "iconXs"}
            variant={mode === "delete" ? "destructive" : "default"}
          >
            {icon}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{desc}</DialogDescription>
          </DialogHeader>
          {mode === "delete" ? (
            <>
              <span className="font-semibold">
                Delete this {defaultValues?.name} discount?
              </span>
            </>
          ) : (
            <>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name">Discount Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={defaultValues?.name ?? ""}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="grid gap-3 w-full">
                    <Label htmlFor="discount">Discount</Label>
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      defaultValue={defaultValues?.amount ?? ""}
                    />
                  </div>
                  <div className="grid gap-3 w-1/4">
                    <Label htmlFor="type">type</Label>
                    {/* <Input
                      id="type"
                      name="type"
                      defaultValue={defaultValues?.type ?? ""}
                    /> */}
                    <Select
                      name="type"
                      defaultValue={defaultValues?.type ?? ""}
                    >
                      <SelectTrigger className="w-fit">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent id="type">
                        <SelectItem value="PERCENTAGE">%</SelectItem>
                        <SelectItem value="NOMINAL">K</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={formatDateForInput(defaultValues?.date)}
                  />
                </div>
              </div>
            </>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {mode === "create" && <Button type="submit">Create</Button>}
            {mode === "edit" && <Button type="submit">Save changes</Button>}
            {mode === "delete" && (
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default DiscountForm;
