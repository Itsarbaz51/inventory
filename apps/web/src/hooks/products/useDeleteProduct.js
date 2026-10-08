"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import productService from "@/services/productApi";

export default function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.delete,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}