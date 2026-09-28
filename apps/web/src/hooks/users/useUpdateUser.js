"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import services from "@/services/userApi";
import useToast from "../useToast";

export default function useUpdateUser() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: services.update,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      toast.success(
        response?.message || "User updated successfully",
        "Success",
      );
    },

    onError: (error) => {
      const message =
        error?.response?.data?.errors || error?.response?.data?.message || "Failed to update user.";

      toast.error(message, "User update failed");

      console.error("Update user failed:", error?.response?.data || error);
    },
  });
}
