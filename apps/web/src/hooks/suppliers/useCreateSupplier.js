"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import services from "@/services/supplierApi";
import useToast from "../useToast";

export default function useCreateSupplier() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: services.create,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });

      toast.success(
        response?.message || "Supplier created successfully",
        "Success",
      );
    },

    onError: (error) => {
      const response = error?.response?.data;

      toast.error(
        response?.errors || response?.message || "Failed to create supplier",
        "Validation failed",
      );
    },
  });
}
