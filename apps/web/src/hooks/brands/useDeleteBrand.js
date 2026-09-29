"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBrandApi } from "@/services/brandApi";

export default function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBrandApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["brands"],
      });
    },
  });
}
