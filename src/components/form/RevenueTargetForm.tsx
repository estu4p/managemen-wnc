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
import { Input } from "../ui/input";
import { formatDateForInput } from "@/lib/format";
import { startTransition, useActionState, useEffect, useState } from "react";
import { createRevenueTarget, updateRevenueTarget } from "@/lib/action";
import { DefaultValues, useForm } from "react-hook-form";
import {
  revenueTargetSchema,
  RevenueTargetSchema,
} from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type RevenueTargetsProps = {
  mode: "create" | "edit";
  defaultValues?: {
    id?: number;
    title?: string;
    category?: string | null;
    totalTarget?: number;
    fromDate?: Date;
    untilDate?: Date;
    status?: string;
  };
};

const RevenueTargetForm = ({ mode, defaultValues }: RevenueTargetsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const title = mode === "create" ? "Add Target" : "Edit Target";

  const desc =
    mode === "create"
      ? "Create a new target by filling in the details below."
      : "Change the target here. Click save when finished.";

  const icon =
    mode === "create" ? (
      <>
        {" "}
        <Plus /> Add Target{" "}
      </>
    ) : (
      <SquarePen />
    );

  const [state, formAction] = useActionState(
    mode === "create" ? createRevenueTarget : updateRevenueTarget,
    { success: false, error: false }
  );

  const safeDefaults: DefaultValues<RevenueTargetSchema> = defaultValues
    ? {
        ...defaultValues,
        category: defaultValues.category as
          | "DAILY"
          | "WEEKLY"
          | "MONTHLY"
          | "YEARLY"
          | "OTHER",
        status: defaultValues.status as "PROCESS" | "SUCCESS" | "FAILED",
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
        category: "OTHER",
        fromDate: new Date(),
        untilDate: new Date(),
        totalTarget: undefined,
        status: "PROCESS",
      };

  const form = useForm<RevenueTargetSchema>({
    resolver: zodResolver(revenueTargetSchema),
    defaultValues: safeDefaults,
  });

  const onSubmit = form.handleSubmit((data) =>
    startTransition(() => formAction(data))
  );

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(
        `Revenue target has been ${mode === "create" ? "created" : "updated"}!`,
        {
          // description: `The new service has been ${
          //   mode === "create" ? "saved" : "updated"
          // } to the database.`,
          duration: 4000,
          position: "top-center",
          className: "font-semibold text-black",
          descriptionClassName: "text-black",
        }
      );
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
  }, [dialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size={mode === "create" ? "sm" : "iconXs"}>{icon}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{desc}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
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
                  <FormLabel>Target Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Input target title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      name="category"
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent id="category">
                        <SelectItem value="DAILY">Daily</SelectItem>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalTarget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Target</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Input total target"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between gap-3">
              <FormField
                control={form.control}
                name="fromDate"
                render={({ field }) => (
                  <FormItem className="w-full">
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
                  <FormItem className="w-full">
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
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      name="status"
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent id="status">
                        <SelectItem value="PROCESS">Process</SelectItem>
                        <SelectItem value="SUCCESS">Success</SelectItem>
                        <SelectItem value="FAILED">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              {mode === "create" ? (
                <Button type="submit">Create</Button>
              ) : (
                <Button type="submit">Save changes</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RevenueTargetForm;
