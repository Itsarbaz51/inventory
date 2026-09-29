"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUnitApi } from "@/services/unitApi";

export default function useCreateUnit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUnitApi,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["units"],
            });
        },
    });
}
