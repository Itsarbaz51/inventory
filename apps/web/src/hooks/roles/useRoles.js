"use client";

import { useQuery } from "@tanstack/react-query";

import services from "@/services/roleApi";

export default function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: services.getAll,
  });
}
