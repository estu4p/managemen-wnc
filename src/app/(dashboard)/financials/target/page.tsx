"use client";
import HeaderPage from "@/components/HeaderPage";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
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

const RevenueTargetPage = () => {
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
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Revenue Target"
        desc="Manage your revenue target."
        calendar={false}
      />
      <div className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-between items-center lg:w-[27%]">
              <div className="mt-4 sm:mt-0">
                <h2 className="font-medium">Target</h2>
                <p className="text-muted-foreground">Add Revenue Target</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleTotalItem}>
                <Plus />
                Add Target
              </Button>
            </div>
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
                                <Select>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Target category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">
                                      Weekly
                                    </SelectItem>
                                    <SelectItem value="mounthly">
                                      Mounthly
                                    </SelectItem>
                                    <SelectItem value="yearly">
                                      Yearly
                                    </SelectItem>
                                    <SelectItem value="others">
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
                                  {...field}
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
      </div>
    </div>
  );
};

export default RevenueTargetPage;
