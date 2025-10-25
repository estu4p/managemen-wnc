"use client";

import { useActionState, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateStatusUser } from "@/lib/action";

type UpdateStatusUserProps = {
  id: string;
  status: string;
};

type State = {
  success: boolean;
  error: boolean;
};

const UpdateStatusUser = ({ id, status }: UpdateStatusUserProps) => {
  const [selectStatus, setSelectStatus] = useState(status);
  const [isOpen, setIsOpen] = useState(false);

  const initialState: State = {
    success: false,
    error: false,
  };

  const [state, formAction, isPending] = useActionState<State, FormData>(
    updateStatusUser,
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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Badge variant="default" className="cursor-pointer text-xs lowercase">
          {status}
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="text-sm bg-accent">
        <form action={formAction}>
          <input type="hidden" name="id" value={id} />
          <input type="hidden" name="status" value={selectStatus} />
          <div className="flex items-center justify-between">
            <h4>Select Status : </h4>
            <div className="flex gap-2">
              <Badge
                variant={`${selectStatus === "ACTIVE" ? "green" : "outline"}`}
                className="cursor-pointer"
                onClick={() => setSelectStatus("ACTIVE")}
              >
                Active
              </Badge>
              <Badge
                variant={`${selectStatus === "INACTIVE" ? "green" : "outline"}`}
                className="cursor-pointer"
                onClick={() => setSelectStatus("INACTIVE")}
              >
                Inactive
              </Badge>
            </div>
          </div>

          <Separator className="my-2 h-4" />
          <div className="flex items-center justify-between">
            <div className="text-[13px]">
              <span>Status now:</span>
              <span className="text-secondary-green ml-3 underline">
                {status}
              </span>
            </div>
            <button
              type="submit"
              className="bg-primary rounded-md text-white px-3 py-0.5 font-medium cursor-pointer disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Updating...
                </div>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default UpdateStatusUser;
