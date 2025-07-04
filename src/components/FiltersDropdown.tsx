import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type FiltersDropdownProps = {
  filterStatusData: { id: string; label: string }[];
  title?: string;
  subTitle?: string;
  filterBy?: boolean;
};

function FiltersDropdown({
  filterStatusData,
  title = "Filters",
  filterBy = true,
  subTitle = "Order Status",
}: FiltersDropdownProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="outline" className="text-base font-medium border-none">
          {title}
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
              <Checkbox id={item.id} />
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
