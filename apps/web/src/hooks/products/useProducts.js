"use client";

import { useQuery } from "@tanstack/react-query";
import productService from "@/services/productApi";

export default function useProducts(params = {}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.getAll(params),
    keepPreviousData: true,
  });
}