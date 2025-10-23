"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { startTransition, useActionState, useEffect, useState } from "react";
import { createUser, updateUser } from "@/lib/action";
import { userSchema, UserSchema } from "@/lib/formValidationSchemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

type UserFormProps = {
  mode: "create" | "update";
  defaultValues?: User;
};

// const InventoryForm = ({ mode, defaultValues }: InventoryFormProps) => {

const UserForm = ({ mode, defaultValues }: UserFormProps) => {
  const [isEditing, setIsEditing] = useState(mode === "create");
  const [showPassword, setShowPassword] = useState(false);

  const [state, formAction] = useActionState(
    mode === "create" ? createUser : updateUser,
    { success: false, error: false }
  );

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues ?? {
      id: undefined,
      name: "",
      username: "",
      password: "",
      role: "ADMIN",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(() => formAction(data));
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`User has been ${mode === "create" ? "created" : "updated"}!`, {
        duration: 4000,
        position: "top-center",
        className: "font-semibold text-black",
        descriptionClassName: "text-black",
      });
      router.refresh();
      setIsEditing(false);
    }
  }, [state, router, mode]);

  return (
    <div className="mt-6">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-[30%]">
              <h2 className="font-medium">Admin Data</h2>
              <p className="text-muted-foreground">Edit your Data</p>
            </div>
            <div className="flex max-sm:w-[95%] mt-4 lg:mt-0 lg:w-[50%] max-lg:items-center max-lg:justify-center">
              <div className="sm:w-[70%] lg:w-full space-y-6">
                <div className="flex gap-6 items-start ">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Name
                          <span className="text-red-700">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter username"
                            {...field}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormDescription>
                          Displayed on the profile.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Username
                          <span className="text-red-700">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter name"
                            {...field}
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormDescription>Used to log in.</FormDescription>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-6 items-start ">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Role
                          <span className="text-red-700">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} readOnly />
                        </FormControl>
                        <FormDescription>
                          Select the user's role.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Status
                          <span className="text-red-700">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            // value={field.value ?? ""}
                            value="active"
                            onValueChange={field.onChange}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Inventory category" />
                            </SelectTrigger>
                            <SelectContent id="status">
                              <SelectItem value="ACTIVE">Active</SelectItem>
                              <SelectItem value="INACTIVE">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>
                          Set the account status.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Password */}
          <div>
            <Separator className="my-2" />
            <div className="flex flex-col lg:flex-row mt-4">
              <div className="lg:w-[30%]">
                <h2 className="font-medium">Admin Password</h2>
                <p className="text-muted-foreground">Edit your Password</p>
              </div>
              <div className="flex max-sm:w-[95%] mt-4 lg:mt-0 lg:w-[50%] max-lg:items-center max-lg:justify-center">
                <div className="flex flex-col gap-6 items-start sm:w-[70%] lg:w-full">
                  {mode === "update" && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter current password "
                                {...field}
                                type={showPassword ? "text" : "password"}
                                disabled={!isEditing}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-transparent cursor-pointer w-fit h-fit"
                              >
                                {showPassword ? <Eye /> : <EyeOff />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormDescription>Current password.</FormDescription>
                        </FormItem>
                      )}
                    />
                  )}
                  <div className="flex gap-6 max-sm:flex-col items-start w-full">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter new password"
                              {...field}
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormDescription>
                            At least 8 chars, incl. upper, lower, and number.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>
                            Confirm New Password
                            <span className="text-red-700">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter confirm new name"
                              {...field}
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormDescription>
                            Re-enter to confirm.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end gap-4 w-full">
                    {!isEditing ? (
                      <Button
                        variant="default"
                        size="sm"
                        className="cursor-pointer"
                        onClick={() => setIsEditing(true)}
                        type="button"
                      >
                        Edit
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="cursor-pointer"
                          type="button"
                          onClick={() => {
                            form.reset(defaultValues);
                            if (mode === "create") {
                              router.back();
                            } else {
                              setIsEditing(false);
                            }
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="cursor-pointer"
                          type="submit"
                        >
                          Save
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserForm;
