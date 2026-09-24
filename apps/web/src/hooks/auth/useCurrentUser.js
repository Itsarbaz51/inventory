"use client";

import { useQuery } from "@tanstack/react-query";
import { getMeApi } from "@/services/authApi";

export const useCurrentUser = (options = {}) => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: getMeApi,

        retry: false,

        staleTime: 5 * 60 * 1000,

        ...options,
    });
};