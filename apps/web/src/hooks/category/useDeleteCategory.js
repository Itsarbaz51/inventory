"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategoryApi } from "@/services/categoryApi";

export default function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategoryApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },

    onError: (error) => {
      console.error("Delete category failed:", error?.response?.data || error);
    },
  });
}
