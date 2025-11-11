import { useActionState, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { updateProgress } from "@/lib/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { formatPhoneNumber } from "@/lib/format";

type UpdateProgressProps = {
  id: string;
  progress: string;
  items: any;
  customerName: string;
  phone: string;
};

type State = {
  success: boolean;
  error: boolean;
};

const progressOrder = {
  NEW_ORDER: 0,
  WAITTING: 1,
  ON_PROGRESS: 2,
  FINISHING: 3,
  DONE: 4,
  PICKED_UP: 5,
  CANCELED: 6,
};

export const UpdateProgress = ({
  id,
  progress,
  items,
  customerName,
  phone,
}: UpdateProgressProps) => {
  const [selectedProgresses, setSelectedProgresses] = useState<{
    [key: number]: string;
  }>({});
  const [isOpen, setIsOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const statusLabels = {
    NEW_ORDER: "New Order",
    WAITTING: "Waiting",
    ON_PROGRESS: "On Progress",
    FINISHING: "Finishing",
    DONE: "Done",
    PICKED_UP: "Picked Up",
    CANCELED: "Canceled",
  };

  const initialState: State = {
    success: false,
    error: false,
  };

  const [state, formAction, isPending] = useActionState<State, FormData>(
    updateProgress,
    initialState
  );

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success("Progress updated successfully", {
        duration: 4000,
        position: "top-center",
        className: "font-semibold text-black",
        descriptionClassName: "text-black",
        richColors: true,
      });
      setIsOpen(false);
      const allDone = items.every((item: any) => {
        const p = selectedProgresses[item.id] || item.progress || progress;
        return p === "DONE";
      });

      if (allDone) {
        setShowDialog(true);
      }

      setTimeout(() => {
        router.refresh();
      }, 300);
    }

    if (state.error) {
      toast.error("Failed to update progress", {
        duration: 4000,
        position: "top-center",
        className: "font-semibold text-black",
        descriptionClassName: "text-black",
        richColors: true,
      });
    }
  }, [state, router]);

  useEffect(() => {
    const initialProgresses: { [key: number]: string } = {};
    items.forEach((item: any) => {
      initialProgresses[item.id] = item.progress || progress;
    });
    setSelectedProgresses(initialProgresses);
  }, [items, progress]);

  const handleProgressChange = (itemId: number, newProgress: string) => {
    setSelectedProgresses((prev) => ({
      ...prev,
      [itemId]: newProgress,
    }));
  };

  const getSlowestProgress = () => {
    if (items.length === 0) return progress;

    const allProgresses = items.map((item: any) => {
      return selectedProgresses[item.id] || item.progress || progress;
    });

    let slowestProgress = allProgresses[0];
    let slowestOrder =
      progressOrder[slowestProgress as keyof typeof progressOrder] || 0;

    for (const currentProgress of allProgresses) {
      const currentOrder =
        progressOrder[currentProgress as keyof typeof progressOrder] || 0;
      if (currentOrder < slowestOrder) {
        slowestProgress = currentProgress;
        slowestOrder = currentOrder;
      }
    }

    return slowestProgress;
  };

  const displayProgress = getSlowestProgress();

  return (
    <>
      <div className="flex items-center gap-1">
        <Badge variant={displayProgress as any}>
          {isPending ? (
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
              Updating...
            </div>
          ) : (
            statusLabels[displayProgress as keyof typeof statusLabels] ||
            displayProgress
          )}
        </Badge>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="xxs">
              <ChevronDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 md:w-[400px] md:mr-10">
            <form action={formAction}>
              {/* Tambahkan hidden input untuk id */}
              <input type="hidden" name="id" value={id} />

              <div className="flex md:justify-between border-b">
                <h3 className="text-sm font-semibold md:min-w-30">Name</h3>
                <h3 className="text-sm font-semibold md:w-full">Service</h3>
                <h3 className="text-sm font-semibold">Status</h3>
              </div>
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="w-full flex items-center text-[13px] border-b"
                >
                  <h4 className="md:min-w-30 capitalize">{item.name}</h4>
                  <h4 className="md:w-full">{item.service.join(", ")}</h4>

                  {/* Hidden input untuk setiap item progress */}
                  <input
                    type="hidden"
                    name={`progress_${item.id}`}
                    value={
                      selectedProgresses[item.id] || item.progress || progress
                    }
                  />

                  <Select
                    value={
                      selectedProgresses[item.id] || item.progress || progress
                    }
                    onValueChange={(value) =>
                      handleProgressChange(item.id, value)
                    }
                  >
                    <SelectTrigger className="border-none p-0">
                      {/* PERBAIKAN: Bandingkan nilai enum, bukan label */}
                      {/* {selectedProgresses[item.id] &&
                      selectedProgresses[item.id] !== item.progress && (
                        <div className="w-2 h-2 bg-blue-300 rounded-full mr-1" />
                      )} */}
                      <h4 className="text-[13px]">
                        {statusLabels[
                          selectedProgresses[
                            item.id
                          ] as keyof typeof statusLabels
                        ] ||
                          statusLabels[
                            item.progress as keyof typeof statusLabels
                          ] ||
                          item.progress}
                      </h4>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          <span className="text-muted-foreground text-[13px]">
                            {label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
              <div className="w-full mt-2 text-end space-x-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={isPending}
                  variant="destructive"
                  onClick={() => {
                    if (isPending) return;
                    const reset: { [key: number]: string } = {};
                    items.forEach((item: any) => {
                      reset[item.id] = item.progress || progress;
                    });
                    setSelectedProgresses(reset);
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                  className="disabled:opacity-50"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Updating...
                    </div>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </div>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Share Invoice</AlertDialogTitle>
          <AlertDialogDescription>
            The item is finished and ready for pickup.{" "}
            <span className="font-semibold">
              Share this notification with the customer.
            </span>
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                const phoneNumber = formatPhoneNumber(String(phone));

                const message = `Hallo kak ${customerName}, menginfokan untuk barangnya sudah jadi dan bisa diambil ya. Terima kasih 😊`;
                const whatsAppUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                  message
                )}`;

                window.open(whatsAppUrl, "_blank");
                setShowDialog(false);
              }}
            >
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
