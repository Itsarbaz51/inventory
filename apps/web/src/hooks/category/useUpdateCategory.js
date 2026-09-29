"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategoryApi } from "@/services/categoryApi";

export default function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategoryApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },

    onError: (error) => {
      console.error("Update category failed:", error?.response?.data || error);
    },
  });
}
