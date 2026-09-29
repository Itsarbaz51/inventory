"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategoryApi } from "@/services/categoryApi";

export default function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategoryApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },

    onError: (error) => {
      console.error("Create category failed:", error?.response?.data || error);
    },
  });
}
