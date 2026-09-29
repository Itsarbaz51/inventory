"use client";

import { useQuery } from "@tanstack/react-query";
import { getUnitsApi } from "@/services/unitApi";

export default function useUnits({
    page = 1,
    limit = 12,
    search = "",
    status = "ALL",
} = {}) {
    const params = {
        page,
        limit,

        ...(search.trim() && {
            search: search.trim(),
        }),

        ...(status !== "ALL" && {
            status,
        }),
    };

    return useQuery({
        queryKey: ["units", params],
        queryFn: () => getUnitsApi(params),
        placeholderData: (previousData) => previousData,
    });
}
