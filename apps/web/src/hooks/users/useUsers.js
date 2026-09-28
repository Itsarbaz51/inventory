"use client";

import { useQuery } from "@tanstack/react-query";
import services from "@/services/userApi";

export default function useUsers(params = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => services.getAll(params),
    keepPreviousData: true,
  });
}
