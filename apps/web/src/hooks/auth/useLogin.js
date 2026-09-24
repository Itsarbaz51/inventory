"use client";

import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import { loginApi } from "@/services/authApi";
import { setCredentials } from "@/store/slices/authSlice";

export default function useLogin() {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: loginApi,

        onSuccess: (response) => {
            dispatch(
                setCredentials({
                    user: response.data?.user,
                }),
            );
        },

        onError: (error) => {
            console.error(
                "Login failed:",
                error?.response?.data || error,
            );
        },
    });
}