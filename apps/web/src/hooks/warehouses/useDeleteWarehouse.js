"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteWarehouse } from "@/services/warehouseApi";
import useToast from "../useToast";

export default function useDeleteWarehouse() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: deleteWarehouse,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });

      toast.success(
        response?.message || "Warehouse deleted successfully",
        "Success",
      );
    },

    onError: (error) => {
      const response = error?.response?.data;

      toast.error(
        response?.message || "Failed to delete warehouse",
        "Delete failed",
      );
    },
  });
}
