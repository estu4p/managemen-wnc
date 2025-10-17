"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function MonthPicker() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlMonth = searchParams.get("month");
  const urlYear = searchParams.get("year");

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState<string>(
    urlMonth ? (parseInt(urlMonth) - 1).toString() : currentMonth.toString()
  );
  const [year, setYear] = useState<string>(urlYear || currentYear.toString());
  const [isOpen, setIsOpen] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYearNum = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) =>
    (currentYearNum - 5 + i).toString()
  );

  const handleApply = () => {
    const selectedMonth = parseInt(month) + 1;
    const selectedYear = parseInt(year);

    const params = new URLSearchParams();
    params.set("month", selectedMonth.toString());
    params.set("year", selectedYear.toString());

    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const displayText = `${months[parseInt(month)]} ${year}`;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full font-normal p-0"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayText}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-secondary md:mr-8">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bulan</label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih bulan" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((monthName, index) => (
                    <SelectItem key={monthName} value={index.toString()}>
                      {monthName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tahun</label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahun" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Batal
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Terapkan
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
