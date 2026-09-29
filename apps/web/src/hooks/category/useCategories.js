"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "@/services/categoryApi";

export default function useCategories({
  page = 1,
  limit = 20,
  search = "",
  status = "ALL",
  parentType = "ALL",
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
    ...(parentType !== "ALL" && {
      parentType,
    }),
  };

  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategoriesApi(params),
    placeholderData: (previousData) => previousData,
  });
}
