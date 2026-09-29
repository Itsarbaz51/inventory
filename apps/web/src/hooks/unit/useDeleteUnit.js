"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUnitApi } from "@/services/unitApi";

export default function useDeleteUnit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUnitApi,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["units"],
            });
        },
    });
}
