"use client";

import { useQuery } from "@tanstack/react-query";
import { getBrandsApi } from "@/services/brandApi";

export default function useBrands({
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
        queryKey: ["brands", params],

        queryFn: () => getBrandsApi(params),

        placeholderData: (previousData) =>
            previousData,
    });
}
