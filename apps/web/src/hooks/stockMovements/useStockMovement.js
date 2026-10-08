"use client";

import { useQuery } from "@tanstack/react-query";
import stockMovementService from "@/services/stockMovementApi";

export default function useStockMovement(id) {
  return useQuery({
    queryKey: ["stock-movement", id],
    queryFn: () =>
      stockMovementService.getById(id),
    enabled: !!id,
  });
}