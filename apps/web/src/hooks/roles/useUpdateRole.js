"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateRoleApi } from "@/services/roleApi";
import useToast from "../useToast";

export default function useUpdateRole() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: updateRoleApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },

    onError: (error) => {
      const message =
        error?.response?.data?.message || error || "Invalid email or password.";

      toast.error(message, "Login failed");

      console.error("Update role failed:", error?.response?.data || error);
    },
  });
}
