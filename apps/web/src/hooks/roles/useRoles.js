"use client";

import { useQuery } from "@tanstack/react-query";

import { getRolesApi } from "@/services/roleApi";

export default function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRolesApi,
  });
}
