"use client";

import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { loginApi } from "@/services/authApi";
import useToast from "../useToast";
// import { setCredentials } from "@/store/slices/authSlice";

export default function useLogin() {
    const dispatch = useDispatch();
    const toast = useToast()

    return useMutation({
        mutationFn: loginApi,

        onSuccess: (response) => {
            // dispatch(
            //     setCredentials({
            //         user: response.data?.user,
            //     }),
            // );
            toast.success(
                response.data?.message,
                "Login successful"
            );
        },

        onError: (error) => {
            const message =
                error?.response?.data?.message ||
                "Invalid email or password.";

            toast.error(message, "Login failed");

        },
    });
}