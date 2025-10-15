"use client";

import {
  CircleCheck,
  Clock,
  Droplets,
  FileCheck,
  PackageCheck,
  Sparkles,
  Wind,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@prisma/client";

const itemProgress = [
  Progress.NEW_ORDER,
  Progress.WAITTING,
  Progress.ON_PROGRESS,
  Progress.FINISHING,
  Progress.DONE,
  Progress.PICKED_UP,
  Progress.CANCELED,
];

const steps = [
  {
    id: 1,
    label: "Order Received",
    icon: FileCheck,
    description:
      "Your order has been successfully submitted and is now registered in the system.",
    date: "Sun 19 Nov, 10.14 AM",
    progress: Progress.NEW_ORDER,
  },
  {
    id: 2,
    label: "In Queue",
    icon: Clock,
    description:
      "Your order is in line and waiting for its turn to be processed.",
    date: "May 2, 2023",
    progress: Progress.WAITTING,
  },
  {
    id: 3,
    label: "Washing in Progress",
    icon: Droplets,
    description: "Your item is being cleaned using the proper method.",
    date: "May 3, 2023",
    progress: Progress.ON_PROGRESS,
  },
  // {
  //   id: 4,
  //   label: "Drying",
  //   icon: Wind,
  //   description:
  //     "Your shoes have been cleaned and are now being air-dried or machine-dried.",
  //   date: "May 4, 2023",
  //   progress: Progress.ON_PROGRESS,
  // },
  {
    id: 4,
    label: "Finishing",
    icon: Sparkles,
    description: "Final touches and quality checks are in progress.",
    date: "May 5, 2023",
    progress: Progress.FINISHING,
  },
  {
    id: 5,
    label: "Ready for Pickup",
    icon: CircleCheck,
    description:
      "Your item is fully cleaned and ready to be picked up or delivered.",
    date: "May 6, 2023",
    progress: Progress.DONE,
  },
  {
    id: 6,
    label: "Picked Up",
    icon: PackageCheck,
    description:
      "Your item has been successfully picked up. Thank you for trusting our service!",
    date: "May 6, 2023",
    progress: Progress.PICKED_UP,
  },
];

const TrackingMap = ({ currentProgress }: { currentProgress: Progress }) => {
  const getStepCompletionProgress = (
    stepProgress: Progress,
    current: Progress
  ) => {
    const currentIndex = itemProgress.indexOf(current);
    const stepIndex = itemProgress.indexOf(stepProgress);
    return stepIndex <= currentIndex;
  };

  return (
    <div className="space-y-0 mt-2">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const IconComponent = step.icon;
        const completed = getStepCompletionProgress(
          step.progress,
          currentProgress
        );

        return (
          <div key={step.id} className="relative">
            <div className="flex items-start gap-2">
              <div className="flex flex-col items-center">
                {/* Circle dengan Border Gradient */}
                <div className="relative flex p-1.5 items-center justify-center rounded-full z-10 bg-white">
                  <div
                    className={cn(
                      "absolute -inset-[0.5px] rounded-full p-[3px]",
                      completed
                        ? "bg-gradient-to-b from-secondary-green/40 to-secondary-green"
                        : "bg-gradient-to-b from-gray-400 to-gray-600"
                    )}
                  >
                    <div className="w-full h-full rounded-full bg-white"></div>
                  </div>
                  <IconComponent
                    className={cn(
                      "h-4 w-4 relative z-10",
                      completed
                        ? "text-secondary-green"
                        : "text-muted-foreground"
                    )}
                    strokeWidth={3}
                  />
                </div>

                {/* Garis Putus-Putus */}
                {!isLast && (
                  <div
                    className={cn(
                      "w-[1px] h-14 sm:h-12 dashed-vertical-line",
                      completed ? "text-secondary-green" : "text-gray-400"
                    )}
                  />
                )}
              </div>
              <div className="">
                <p
                  className={cn(
                    "font-medium text-sm",
                    completed ? "text-foreground" : "text-muted-foreground"
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
                      completed ? "text-foreground" : "text-muted-foreground"
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
};

export default TrackingMap;
