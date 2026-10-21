"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import productService from "@/services/productApi";

export default function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.update,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}