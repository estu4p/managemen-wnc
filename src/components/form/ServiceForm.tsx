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

type ServiceFormProps = {
  mode: "create" | "edit" | "delete";
  defaultValues?: {
    name?: string;
    price?: number;
  };
};

const ServiceForm = ({ mode, defaultValues }: ServiceFormProps) => {
  const title =
    mode === "create"
      ? "Add Service"
      : mode === "edit"
      ? "Edit Service"
      : "Delete Service";

  const desc =
    mode === "create"
      ? "Create a new service by filling in the details below."
      : mode === "edit"
      ? "Change the service here. Click save when finished."
      : "Are you sure you want to delete this service? This action cannot be undone.";

  const icon =
    mode === "create" ? (
      <>
        <Plus /> Add Service
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
            className="cursor-pointer"
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
                Delete this {defaultValues?.name} service?
              </span>
            </>
          ) : (
            <>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={defaultValues?.name ?? ""}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue={defaultValues?.price ?? ""}
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

export default ServiceForm;
