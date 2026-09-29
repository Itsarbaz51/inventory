"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBrandApi } from "@/services/brandApi";

export default function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBrandApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["brands"],
      });
    },
  });
}
