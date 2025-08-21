"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
});

type RevenueTargets = {
  id: number;
  category: string;
  fromDate: Date;
  untilDate: Date;
  totalTarget: number;
};

const RevenueTargetForm = ({
  revenueTargets,
}: {
  revenueTargets: RevenueTargets[];
}) => {
  const [isEditing, setIsediting] = useState(false);
  const [totalTargets, setTotalTargets] = useState(1);
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

  function handleTotalItem() {
    setTotalTargets((prev) => prev + 1);
    // Reset the form for the new item
    form.reset({
      name: "",
      phone: "",
    });
  }

  return (
    <>
      {revenueTargets.map((target, index) => (
        <Form {...form} key={index}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {Array.from({ length: totalTargets }).map((_, index) => (
              <div
                key={index}
                className="transition-all duration-300 ease-in-out transform space-y-4 mt-4 sm:mt-0"
              >
                <div className="flex flex-col sm:flex-row mt-2">
                  <div className="w-[20%] lg:w-[30%]">
                    <h2 className="font-medium text-base">
                      Target {index + 1}
                    </h2>
                  </div>
                  <div className="max-sm:w-[95%] lg:w-[50%] mt-4 sm:mt-0 flex max-lg:items-center max-lg:justify-center">
                    <div className="space-y-6 w-full">
                      <div className="flex gap-4 items-start">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>
                                Target Name{" "}
                                <span className="text-red-700">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter target name"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>
                                Category <span className="text-red-700">*</span>
                              </FormLabel>
                              <FormControl>
                                <Select value={target.category}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Target category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="DAILY">Daily</SelectItem>
                                    <SelectItem value="WEEKLY">
                                      Weekly
                                    </SelectItem>
                                    <SelectItem value="MONTHLY">
                                      Mounthly
                                    </SelectItem>
                                    <SelectItem value="YEARLY">
                                      Yearly
                                    </SelectItem>
                                    <SelectItem value="OTHER">
                                      Others
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex gap-4 items-start">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>
                                From Date{" "}
                                <span className="text-red-700">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter from date"
                                  type="date"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>
                                Until Date{" "}
                                <span className="text-red-700">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter until date"
                                  type="date"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel>
                                Total Target{" "}
                                <span className="text-red-700">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter total target"
                                  type="number"
                                  value={target.totalTarget}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex justify-end gap-4">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={index === 0}
                          onClick={() => {
                            if (totalTargets > 1) {
                              setTotalTargets((prev) => prev - 1);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="my-2" />
              </div>
            ))}
          </form>
        </Form>
      ))}
    </>
  );
};

export default RevenueTargetForm;
