"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useCurrentUser } from "@/hooks/auth/useCurrentUser";
import { setUser, clearAuth } from "@/store/slices/authSlice";

function AuthProvider({ children }) {
    const dispatch = useDispatch();

    const {
        data,
        isLoading,
        isSuccess,
        isError,
    } = useCurrentUser();

    useEffect(() => {
        if (isSuccess) {
            const user = data?.data;

            if (user) {
                dispatch(setUser(user));
            }
        }

        if (isError) {
            dispatch(clearAuth());
        }
    }, [
        data,
        isSuccess,
        isError,
        dispatch,
    ]);

    return children;
}

export default AuthProvider;