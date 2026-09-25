"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteRoleApi } from "@/services/roleApi";

export default function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRoleApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },

    onError: (error) => {
      console.error("Delete role failed:", error?.response?.data || error);
    },
  });
}
