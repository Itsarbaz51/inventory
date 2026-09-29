"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBrandApi } from "@/services/brandApi";

export default function useCreateBrand() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createBrandApi,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["brands"],
            });
        },
    });
}
