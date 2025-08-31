"use client";
import { Plus, SquarePen, Trash2 } from "lucide-react";
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
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { formatDateForInput } from "@/lib/format";

type RevenueTargetsProps = {
  mode: "create" | "edit" | "delete";
  defaultValues?: {
    id?: number;
    title?: string;
    category?: string;
    totalTarget?: number;
    fromDate?: Date;
    untilDate?: Date;
  };
};

const RevenueTargetForm = ({ mode, defaultValues }: RevenueTargetsProps) => {
  const title =
    mode === "create"
      ? "Add Target"
      : mode === "edit"
      ? "Edit Target"
      : "Delete Target";

  const desc =
    mode === "create"
      ? "Create a new target by filling in the details below."
      : mode === "edit"
      ? "Change the target here. Click save when finished."
      : "Are you sure you want to delete this target? This action cannot be undone.";

  const icon =
    mode === "create" ? (
      <>
        <Plus /> Add Target
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
                Delete this {defaultValues?.title} target?
              </span>
            </>
          ) : (
            <>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name">Target Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={defaultValues?.title ?? ""}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={defaultValues?.category ?? ""}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="totalTarget">Total Target</Label>
                  <Input
                    id="totalTarget"
                    name="totalTarget"
                    type="number"
                    defaultValue={defaultValues?.totalTarget ?? ""}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="fromDate">From Date</Label>
                  <Input
                    id="fromDate"
                    name="fromDate"
                    type="date"
                    defaultValue={formatDateForInput(defaultValues?.fromDate)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="untilDate">Until Date</Label>
                  <Input
                    id="untilDate"
                    name="untilDate"
                    type="date"
                    defaultValue={formatDateForInput(defaultValues?.untilDate)}
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

export default RevenueTargetForm;
