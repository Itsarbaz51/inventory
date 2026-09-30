"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import customerService from "@/services/customerApi";
import useToast from "../useToast";

export default function useCreateCustomer() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: customerService.create,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      toast.success(
        response?.message || "Customer created successfully",
        "Success",
      );
    },

    onError: (error) => {
      const response = error?.response?.data;

      toast.error(
        response?.errors || response?.message || "Failed to create customer",
        "Validation failed",
      );
    },
  });
}
