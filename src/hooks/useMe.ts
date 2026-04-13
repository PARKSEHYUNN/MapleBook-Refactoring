// src/hooks/useMe.ts

import useSWR from "swr";

import { MeResponse } from "@/types/common";

const fetcher = async (url: string): Promise<MeResponse> => fetch(url).then((r) => r.json());

export function useMe() {
  const { data, error, isLoading, mutate } = useSWR<MeResponse>("/api/me", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  return {
    me: data,
    isLoading,
    isError: !!error,
    isLoggedIn: data?.status !== "UNAUTHORIZED" && !!data,
    mutate,
  };
}
