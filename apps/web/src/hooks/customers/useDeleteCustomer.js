"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import customerService from "@/services/customerApi";
import useToast from "../useToast";

export default function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: customerService.delete,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });

      toast.success(
        response?.message || "Customer deleted successfully",
        "Success",
      );
    },

    onError: (error) => {
      const response = error?.response?.data;

      toast.error(response?.message || "Failed to delete customer", "Error");
    },
  });
}
