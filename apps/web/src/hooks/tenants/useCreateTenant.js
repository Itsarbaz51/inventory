"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import services from "@/services/tenantApi";
import useToast from "../useToast";

export default function useCreateTenant() {
  const queryClient = useQueryClient();
  const toast = useToast()

  return useMutation({
    mutationFn: services.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tenants"],
      });
    },

    onError: (error) => {
      toast.error(error?.response?.data?.errors || error.response.data || error.message || error)
      console.error("Create Tenant failed:", error?.response?.data || error);
    },
  });
}
