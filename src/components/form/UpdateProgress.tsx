import { useActionState, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { updateProgress } from "@/lib/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type UpdateProgressProps = {
  id: string;
  progress: string;
};

type State = {
  success: boolean;
  error: boolean;
};

export const UpdateProgress = ({ id, progress }: UpdateProgressProps) => {
  const [selectedProgress, setSelectedProgress] = useState(progress);
  const [isOpen, setIsOpen] = useState(false);

  const statusLabels = {
    NEW_ORDER: "New Order",
    WAITTING: "Waiting",
    ON_PROGRESS: "On Progress",
    PICKED_UP: "Ready for Pick Up",
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
      toast.success("Status updated successfully");
      setIsOpen(false);

      setTimeout(() => {
        router.refresh();
      }, 300);
    }

    if (state.error) {
      toast.error("Failed to update status");
    }
  }, [state, router]);

  // Reset selectedProgress ketika progress prop berubah
  useEffect(() => {
    setSelectedProgress(progress);
  }, [progress]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="cursor-pointer" disabled={isPending}>
          <Badge variant={progress as any}>
            {isPending ? (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
                Updating...
              </div>
            ) : (
              statusLabels[progress as keyof typeof statusLabels] || progress
            )}
          </Badge>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <h3 className="text-sm font-medium mb-3">Select Progress:</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(statusLabels).map(([key, label]) => (
            <div key={key} className="flex flex-col items-center">
              <Badge
                variant={key as any}
                className={`cursor-pointer w-full text-center transition-all ${
                  key === selectedProgress
                    ? "ring-2 ring-primary ring-offset-1"
                    : "opacity-80 hover:opacity-100"
                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => !isPending && setSelectedProgress(key)}
              >
                {label}
              </Badge>
              {key === selectedProgress && (
                <div className="w-full flex justify-center mt-1">
                  <div className="bg-primary h-1 rounded-full w-3/4" />
                </div>
              )}
            </div>
          ))}
        </div>
        <Separator className="my-2" />
        <form action={formAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="progress" value={selectedProgress} />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Current: {statusLabels[progress as keyof typeof statusLabels]}
            </span>
            <Button
              type="submit"
              size="sm"
              disabled={isPending || selectedProgress === progress}
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
  );
};
