"use client";

import { useQuery } from "@tanstack/react-query";
import { getWarehouses } from "@/services/warehouseApi";

export default function useWarehouses(params) {
  return useQuery({
    queryKey: ["warehouses", params],
    queryFn: () => getWarehouses(params),
    keepPreviousData: true,
  });
}
