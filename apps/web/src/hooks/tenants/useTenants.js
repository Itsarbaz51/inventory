"use client";

import {
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";

import services from "@/services/tenantApi";

export default function useTenants({
  page = 1,
  limit = 10,
  search = "",
  status,
} = {}) {
  return useQuery({
    queryKey: [
      "tenants",
      {
        page,
        limit,
        search,
        status,
      },
    ],

    queryFn: () =>
      services.getAll({
        page,
        limit,
        search,
        status,
      }),

    placeholderData: keepPreviousData,
  });
}