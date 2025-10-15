"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";

const HeaderPage = ({
  title,
  desc,
  calendar = true,
}: {
  title: string;
  desc: string;
  calendar?: boolean;
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end justify-between mb-3">
      <div className="">
        <h1 className="font-medium text-lg">{title}</h1>
        <p className="text-muted-foreground mt-1">{desc}</p>
      </div>
      {calendar && (
        <div className="max-sm:w-full text-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full font-normal p-0"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "d MMMM yyyy") : "Select Date"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    </div>
  );
};

export default HeaderPage;
