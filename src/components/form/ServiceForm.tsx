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
import { ServiceSchema, serviceSchema } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createService, deleteService, updateService } from "@/lib/action";
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
  mode: "create" | "edit" | "delete";
  defaultValues?: {
    id?: number;
    name?: string;
    price?: number;
  };
};

const ServiceForm = ({ mode, defaultValues }: ServiceFormProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

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
    startTransition(() => {
      formAction(data);
    });
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
      router.refresh();
    }
  }, [state, mode, router]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <>
              {mode === "delete" ? (
                <>
                  <span className="font-semibold">
                    Delete this {defaultValues?.name} service?
                  </span>
                </>
              ) : (
                <>
                  {/* <div className="grid gap-4"> */}
                  {/* <div className="grid gap-3">
                      <Label htmlFor="name">Service Name</Label>
                      <Input
                        id="name"
                        name="name"
                        defaultValue={defaultValues?.name ?? ""}
                      />
                    </div> */}
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
                            type="number"
                            {...field}
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
                  {/* </div> */}
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
            </>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;
