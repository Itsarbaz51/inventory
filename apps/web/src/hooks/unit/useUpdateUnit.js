"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUnitApi } from "@/services/unitApi";

export default function useUpdateUnit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateUnitApi,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["units"],
            });
        },
    });
}
