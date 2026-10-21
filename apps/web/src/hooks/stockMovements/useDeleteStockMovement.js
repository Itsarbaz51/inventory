"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import stockMovementService from "@/services/stockMovementApi";

export default function useDeleteStockMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stockMovementService.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-movements"],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}