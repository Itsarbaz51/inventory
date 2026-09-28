"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteUserApi } from "@/services/userApi";

export default function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error) => {
      console.error("Delete user failed:", error?.response?.data || error);
    },
  });
}
