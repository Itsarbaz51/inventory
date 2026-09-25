"use client";

import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import { logoutApi } from "@/services/authApi";
import { clearAuth } from "@/store/slices/authSlice";

export default function useLogout() {
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutApi,

    onSuccess: (response) => {
      dispatch(clearAuth());
      router.replace("/login");
    },

    onError: (error) => {
      console.error("Logout failed:", error?.response?.data || error);
      dispatch(clearAuth());
      router.replace("/login");
    },
  });
}
