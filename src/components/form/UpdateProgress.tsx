import { useActionState, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { updateProgress } from "@/lib/action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

type UpdateProgressProps = {
  id: string;
  progress: string;
  items: any;
};

type State = {
  success: boolean;
  error: boolean;
};

// Urutan progress dari yang paling lambat ke paling cepat - SESUAIKAN DENGAN DATABASE
const progressOrder = {
  NEW_ORDER: 0,
  WAITTING: 1,
  ON_PROGRESS: 2,
  FINISHING: 3,
  DONE: 4, // Tambahkan DONE
  PICKED_UP: 5, // Sesuaikan urutan
  CANCELED: 6, // Tambahkan CANCELED
};

export const UpdateProgress = ({
  id,
  progress,
  items,
}: UpdateProgressProps) => {
  const [selectedProgresses, setSelectedProgresses] = useState<{
    [key: number]: string;
  }>({});
  const [isOpen, setIsOpen] = useState(false);

  // Pastikan ini sesuai dengan enum Progress di database
  const statusLabels = {
    NEW_ORDER: "New Order",
    WAITTING: "Waiting",
    ON_PROGRESS: "On Progress",
    FINISHING: "Finishing",
    DONE: "Done", // Ubah ke "Done" untuk konsistensi
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

  // Inisialisasi selectedProgresses ketika items berubah
  useEffect(() => {
    const initialProgresses: { [key: number]: string } = {};
    items.forEach((item: any) => {
      initialProgresses[item.id] = item.progress || progress;
    });
    setSelectedProgresses(initialProgresses);
  }, [items, progress]);

  // Handler untuk mengubah progres item tertentu
  const handleProgressChange = (itemId: number, newProgress: string) => {
    setSelectedProgresses((prev) => ({
      ...prev,
      [itemId]: newProgress,
    }));
  };

  // Fungsi untuk mendapatkan progress ter lambat
  const getSlowestProgress = () => {
    if (items.length === 0) return progress;

    // Gunakan progress yang sudah dipilih jika ada, kalau tidak gunakan progress asli item
    const allProgresses = items.map((item: any) => {
      return selectedProgresses[item.id] || item.progress || progress;
    });

    // Cari progress dengan nilai terendah (paling lambat)
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
                        selectedProgresses[item.id] as keyof typeof statusLabels
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
            <div className="w-full mt-2 text-end">
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
  );
};

// <Popover open={isOpen} onOpenChange={setIsOpen}>
//   <PopoverTrigger asChild>
//     <button className="cursor-pointer" disabled={isPending}>
//       <Badge variant={progress as any}>
//         {isPending ? (
//           <div className="flex items-center gap-1">
//             <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
//             Updating...
//           </div>
//         ) : (
//           statusLabels[progress as keyof typeof statusLabels] || progress
//         )}
//       </Badge>
//     </button>
//   </PopoverTrigger>
//   <PopoverContent className="w-80 p-4">
//     <h3 className="text-sm font-medium mb-3">Select Progress:</h3>
//     <div className="grid grid-cols-2 gap-2">
//       {Object.entries(statusLabels).map(([key, label]) => (
//         <div key={key} className="flex flex-col items-center">
//           <Badge
//             variant={key as any}
//             className={`cursor-pointer w-full text-center transition-all ${
//               key === selectedProgress
//                 ? "ring-2 ring-primary ring-offset-1"
//                 : "opacity-80 hover:opacity-100"
//             } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
//             onClick={() => !isPending && setSelectedProgress(key)}
//           >
//             {label}
//           </Badge>
//           {key === selectedProgress && (
//             <div className="w-full flex justify-center mt-1">
//               <div className="bg-primary h-1 rounded-full w-3/4" />
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//     <Separator className="my-2" />
//     <form action={formAction}>
//       <input type="hidden" name="id" value={id} />
//       <input type="hidden" name="progress" value={selectedProgress} />
//       <div className="flex justify-between items-center">
//         <span className="text-xs text-muted-foreground">
//           Current: {statusLabels[progress as keyof typeof statusLabels]}
//         </span>
//         <Button
//           type="submit"
//           size="sm"
//           disabled={isPending || selectedProgress === progress}
//           className="disabled:opacity-50"
//         >
//           {isPending ? (
//             <div className="flex items-center gap-2">
//               <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
//               Updating...
//             </div>
//           ) : (
//             "Update Status"
//           )}
//         </Button>
//       </div>
//     </form>
//   </PopoverContent>
// </Popover>
