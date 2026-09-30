"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWarehouse } from "@/services/warehouseApi";
import useToast from "../useToast";

export default function useCreateWarehouse() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: createWarehouse,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });

      toast.success(
        response?.message || "Warehouse created successfully",
        "Success",
      );
    },

    onError: (error) => {
      const response = error?.response?.data;

      toast.error(
        response?.errors || response?.message || "Failed to create warehouse",
        "Validation failed",
      );
    },
  });
}
