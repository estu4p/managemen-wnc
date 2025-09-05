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
import { Input } from "../ui/input";
import { formatDateForInput } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DefaultValues, useForm } from "react-hook-form";
import { discountSchema, DiscountSchema } from "@/lib/formValidationSchemas";
import { startTransition, useActionState, useEffect, useState } from "react";
import { createDiscount, updateDiscount } from "@/lib/action";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type DiscountFormProps = {
  mode: "create" | "edit" | "delete";
  defaultValues?: {
    id?: number;
    title?: string;
    amount?: number;
    type?: string;
    fromDate?: Date;
    untilDate?: Date;
  };
};

const DiscountForm = ({ mode, defaultValues }: DiscountFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

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

  const [state, formAction] = useActionState(
    mode === "create" ? createDiscount : updateDiscount,
    {
      success: false,
      error: false,
    }
  );

  const safeDefaults: DefaultValues<DiscountSchema> = defaultValues
    ? {
        ...defaultValues,
        type: defaultValues.type as "NOMINAL" | "PERCENTAGE",
        fromDate: defaultValues.fromDate
          ? new Date(defaultValues.fromDate)
          : new Date(),
        untilDate: defaultValues.untilDate
          ? new Date(defaultValues.untilDate)
          : new Date(),
      }
    : {
        id: undefined,
        title: "",
        amount: undefined,
        type: "NOMINAL",
        fromDate: new Date(),
        untilDate: new Date(),
      };

  const form = useForm<DiscountSchema>({
    resolver: zodResolver(discountSchema),
    defaultValues: safeDefaults,
  });

  const onSubmit = form.handleSubmit((data) =>
    startTransition(() => formAction(data))
  );

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Service has been ${mode === "create" ? "created" : "updated"}!`, {
        // description: `The new service has been ${
        //   mode === "create" ? "saved" : "updated"
        // } to the database.`,
        duration: 4000,
        position: "top-center",
        className: "font-semibold text-black",
        descriptionClassName: "text-black",
      });
      setDialogOpen(false);
      setTimeout(() => {
        router.refresh();
      }, 300);
    }
  }, [state, mode, router]);

  useEffect(() => {
    if (dialogOpen) {
      form.reset(safeDefaults);
    }
    console.log("buka");
  }, [dialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "delete" ? (
              <>
                <span className="font-semibold">
                  Delete this {defaultValues?.title} discount?
                </span>
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => <input type="hidden" {...field} />}
                />
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Input discount title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between gap-3">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Amount</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Input discount amount"
                            {...field}
                            type="number"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <FormControl>
                          <Select
                            name="type"
                            value={field.value ?? ""}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-fit">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent id="type">
                              <SelectItem value="PERCENTAGE">%</SelectItem>
                              <SelectItem value="NOMINAL">K</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <FormField
                    control={form.control}
                    name="fromDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Form Date</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            value={
                              field.value ? formatDateForInput(field.value) : ""
                            }
                            onChange={(e) =>
                              field.onChange(new Date(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="untilDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Until Date</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            value={
                              field.value ? formatDateForInput(field.value) : ""
                            }
                            onChange={(e) =>
                              field.onChange(new Date(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DiscountForm;
