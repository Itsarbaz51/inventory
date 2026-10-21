"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import stockMovementService from "@/services/stockMovementApi";

export default function useCreateStockMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stockMovementService.create,

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