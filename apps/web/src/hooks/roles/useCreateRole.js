"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createRoleApi } from "@/services/roleApi";

export default function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRoleApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },

    onError: (error) => {
      console.error("Create role failed:", error?.response?.data || error);
    },
  });
}
