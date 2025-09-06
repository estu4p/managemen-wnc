"use client";

import { Plus, SquarePen } from "lucide-react";
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
import { ServiceSchema, serviceSchema } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createService, updateService } from "@/lib/action";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ServiceFormProps = {
  mode: "create" | "edit";
  defaultValues?: {
    id?: number;
    name?: string;
    price?: number;
  };
};

const ServiceForm = ({ mode, defaultValues }: ServiceFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const title = mode === "create" ? "Add Service" : "Edit Service";

  const desc =
    mode === "create"
      ? "Create a new service by filling in the details below."
      : "Change the service here. Click save when finished.";

  const icon =
    mode === "create" ? (
      <>
        <Plus /> Add Service
      </>
    ) : (
      <SquarePen />
    );

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<ServiceSchema>({
  //   resolver: zodResolver(serviceSchema),
  // });

  const [state, formAction] = useActionState(
    mode === "create" ? createService : updateService,
    { success: false, error: false }
  );

  const form = useForm<ServiceSchema>({
    resolver: zodResolver(serviceSchema),
    defaultValues: defaultValues ?? {
      id: undefined,
      name: "",
      price: undefined,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(() => formAction(data));
  });

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
      form.reset(defaultValues);
    }
  }, [dialogOpen]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size={mode === "create" ? "sm" : "iconXs"}
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
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <>
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => <input type="hidden" {...field} />}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Input service name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Input service price"
                        type="number"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
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
            </>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;
