"use client";

import { useQuery } from "@tanstack/react-query";
import services from "@/services/supplierApi";

export default function useSuppliers(params = {}) {
  return useQuery({
    queryKey: ["suppliers", params],

    queryFn: () => services.getAll(params),

    keepPreviousData: true,
  });
}
