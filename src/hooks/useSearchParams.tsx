import { useCallback } from "react";
import {
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";

export function useSearchParams() {
  const router = useRouter();
  const searchParams = useNextSearchParams();

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const newUrl = `?${params.toString()}`;
      const currentUrl = `?${searchParams.toString()}`;

      if (newUrl !== currentUrl) {
        router.push(newUrl, { scroll: false });
      }
    },
    [searchParams, router]
  );

  return {
    searchParams,
    updateSearchParams,
  };
}
