"use client";

import { useQuery } from "@tanstack/react-query";
import stockMovementService from "@/services/stockMovementApi";

export default function useStockMovements(params = {}) {
    return useQuery({
        queryKey: ["stock-movements", params],
        queryFn: () =>
            stockMovementService.getAll(params),
        keepPreviousData: true,
    });
}