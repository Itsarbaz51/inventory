"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import services from "@/services/userApi";
import useToast from "../useToast";

export default function useCreateUser() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: services.create,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      toast.success(
        response?.message || "User created successfully",
        "Success",
      );
    },

    onError: (error) => {
      const response = error?.response?.data;

      console.error("Create user failed:", response || error);

      toast.error(
        response?.message || "Failed to create user",
        "Validation failed",
      );
    },
  });
}
