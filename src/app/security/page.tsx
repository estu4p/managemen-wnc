"use client";
import HeaderPage from "@/components/HeaderPage";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
});

const SecurityPage = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Form Data:", data);
  }
  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Security"
        desc="Manage your acount security settings."
        calendar={false}
      />
      <div className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-[30%]">
                <h2 className="font-medium">Admin Data</h2>
                <p className="text-muted-foreground">Edit your Data</p>
              </div>
              <div className="flex max-sm:w-[95%] mt-4 lg:mt-0 lg:w-[50%] max-lg:items-center max-lg:justify-center">
                <div className="flex gap-6 items-start sm:w-[70%] lg:w-full">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Username
                          <span className="text-red-700">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter username" {...field} />
                        </FormControl>
                        <FormDescription>
                          This username is used to login to your account.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>
                          Name
                          <span className="text-red-700">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This name is used to display on your profile.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
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
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter current password "
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Current password.</FormDescription>
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-6 max-sm:flex-col items-end w-full">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter new password"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter New password.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
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
                              />
                            </FormControl>
                            <FormDescription>
                              Confirm new password.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
      {/* <div className="gap-4 mt-6 flex flex-col sm:flex-row">
        <div className="w-fit space-y-2">
          <Label htmlFor="username" className="font-medium">
            Username
          </Label>
          <Input id="username" value="Admin" className="w-[250px]" />
          <p className="text-sm text-muted-foreground">
            This username is used to login to your account.
          </p>
        </div>
        <div className="w-fit space-y-2">
          <Label htmlFor="name" className="font-medium">
            Name
          </Label>
          <Input id="name" value="Admin" className="w-[250px]" />
          <p className="text-sm text-muted-foreground">
            This name is used to display on your profile.
          </p>
        </div>
      </div>
      <div className="w-fit space-y-2 mt-6">
        <Label htmlFor="password" className="font-medium">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value="Admin"
          className="w-[250px]"
        />
        <p className="text-sm text-muted-foreground">Current password</p>
        <Input
          id="newPassword"
          type="password"
          value="Admin"
          className="w-[250px]"
        />
        <p className="text-sm text-muted-foreground">New password</p>
        <Input
          id="confirmNewPassword"
          type="password"
          value="Admin"
          className="w-[250px]"
        />
        <p className="text-sm text-muted-foreground">Confirm new password</p>
      </div> */}
    </div>
  );
};

export default SecurityPage;
