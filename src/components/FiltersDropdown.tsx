import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ChevronDown, Filter } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "@/lib/utils";

type FiltersDropdownProps = {
  filterStatusData: { id: string; label: string }[];
  title?: string;
  subTitle?: string;
  filterBy?: boolean;
  className?: string;
};

function FiltersDropdown({
  filterStatusData,
  title = "Filters",
  filterBy = true,
  subTitle = "Order Status",
  className,
}: FiltersDropdownProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="border-none">
          <Filter className="" />
          <span className={cn("border-none text-base font-medium", className)}>
            {title}
          </span>
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] mr-8">
        <span className="font-medium text-muted-foreground text-sm">
          {subTitle}
        </span>
        <div className="mt-2 space-y-3">
          {filterStatusData.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Checkbox
                id={item.id}
                className=" data-[state=checked]:bg-secondary-green data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-secondary-green data-[state=checked]:border-secondary-green"
              />
              <Label htmlFor={item.id}>{item.label}</Label>
            </div>
          ))}
        </div>
        {filterBy && (
          <div className="mt-4">
            <span className="font-medium text-muted-foreground text-sm">
              Filter By
            </span>
            <RadioGroup className="mt-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="recentOrder" id="recentOrder" />
                <Label htmlFor="recentOrder">Recent Order</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="oldOrder" id="oldOrder" />
                <Label htmlFor="oldOrder">Old Order</Label>
              </div>
            </RadioGroup>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default FiltersDropdown;
