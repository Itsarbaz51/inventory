"use client";

import { useQuery } from "@tanstack/react-query";
import customerService from "@/services/customerApi";

export default function useCustomers(params = {}) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => customerService.getAll(params),
    keepPreviousData: true,
  });
}
