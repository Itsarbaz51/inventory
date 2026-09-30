"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import services from "@/services/supplierApi";
import useToast from "../useToast";

export default function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: services.update,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });

      toast.success(
        response?.message || "Supplier updated successfully",
        "Success",
      );
    },

    onError: (error) => {
      const response = error?.response?.data;

      toast.error(
        response?.errors || response?.message || "Failed to update supplier",
        "Update failed",
      );
    },
  });
}
