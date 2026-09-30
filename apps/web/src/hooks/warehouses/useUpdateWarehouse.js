"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateWarehouse } from "@/services/warehouseApi";
import useToast from "../useToast";

export default function useUpdateWarehouse() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: updateWarehouse,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });

      toast.success(
        response?.message || "Warehouse updated successfully",
        "Success",
      );
    },

    onError: (error) => {
      const response = error?.response?.data;

      toast.error(
        response?.errors || response?.message || "Failed to update warehouse",
        "Update failed",
      );
    },
  });
}
