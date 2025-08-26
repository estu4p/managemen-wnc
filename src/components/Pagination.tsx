"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getPaginationRange } from "@/lib/pagination";

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter();

  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const prevNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };
  return (
    <div className="flex items-center mt-3">
      <div className="flex items-center justify-center w-full gap-1">
        {getPaginationRange(page, Math.ceil(count / ITEM_PER_PAGE)).map(
          (p, i) =>
            p === "..." ? (
              <span key={`dots-${i}`} className="px-2">
                ...
              </span>
            ) : (
              <Button
                variant="link"
                size="sm"
                key={`page-${p}`}
                className={`px-2 rounded-sm ${
                  page === p ? "" : "text-gray-500"
                }`}
                onClick={() => changePage(Number(p))}
              >
                {p}
              </Button>
            )
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPrev}
          onClick={() => {
            changePage(page - 1);
          }}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!prevNext}
          onClick={() => changePage(page + 1)}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
