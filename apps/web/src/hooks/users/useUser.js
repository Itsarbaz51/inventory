"use client";

import { useQuery } from "@tanstack/react-query";
import services from "@/services/userApi";

export default function useUser(id, options = {}) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => services.getById(id),
    enabled: !!id,
    ...options,
  });
}
