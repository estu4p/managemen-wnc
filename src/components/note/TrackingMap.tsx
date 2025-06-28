"use client";

import { CheckIcon, FolderCheck } from "lucide-react";
import { cn } from "@/lib/utils";

// interface Step {
//   id: number;
//   label: string;
//   description?: string;
//   date?: string;
//   completed: boolean;
// }

const steps = [
  {
    id: 1,
    label: "Order Received",
    icon: FolderCheck,
    description:
      "Your order has been successfully submitted and is now registered in the system.",
    date: "Sun 19 Nov, 10.14 AM",
    completed: true,
  },
  {
    id: 2,
    label: "In Queue",
    icon: FolderCheck,
    description:
      "Your order is in line and waiting for its turn to be processed.",
    date: "May 2, 2023",
    completed: true,
  },
  {
    id: 3,
    label: "Washing in Progress",
    icon: FolderCheck,
    description: "Your shoes are being cleaned using the proper method.",
    date: "May 3, 2023",
    completed: true,
  },
  {
    id: 4,
    label: "Drying",
    icon: FolderCheck,
    description:
      "Your shoes have been cleaned and are now being air-dried or machine-dried.",
    date: "May 4, 2023",
    completed: false,
  },
  {
    id: 5,
    label: "Finishing",
    icon: FolderCheck,
    description: "Final touches and quality checks are in progress.",
    date: "May 5, 2023",
    completed: false,
  },
  {
    id: 6,
    label: "Ready for Pickup",
    icon: FolderCheck,
    description:
      "Your shoes are fully cleaned and ready to be picked up or delivered.",
    date: "May 6, 2023",
    completed: false,
  },
];

// { steps }: { steps: Step[] }

export function TrackingMap() {
  return (
    <div className="space-y-0 mt-2">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="relative">
            <div className="flex items-start gap-2">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-1 z-10 ",
                    step.completed
                      ? "text-primary-foreground border-secondary-green"
                      : "border-muted-foreground"
                  )}
                >
                  <FolderCheck
                    className={cn(
                      "h-5 w-5",
                      step.completed
                        ? "text-secondary-green"
                        : "text-muted-foreground"
                    )}
                    strokeWidth={2}
                  />
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-[1px] h-14 sm:h-12",
                      step.completed
                        ? "bg-secondary-green"
                        : "bg-muted-foreground"
                    )}
                  />
                )}
              </div>
              <div className="">
                <p
                  className={cn(
                    "font-medium text-sm",
                    step.completed ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                )}
                {step.date && (
                  <p
                    className={cn(
                      "text-xs mt-1.5 sm:mt-1",
                      step.completed
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.date}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
