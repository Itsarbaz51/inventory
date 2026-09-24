import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    toasts: [],
};

const toastSlice = createSlice({
    name: "toast",
    initialState,
    reducers: {
        showToast: (state, action) => {
            const id = Date.now() + Math.random();

            state.toasts.push({
                id,
                type: action.payload.type || "info",
                title: action.payload.title || "",
                message: action.payload.message || "",
                duration: action.payload.duration ?? 4000,
            });
        },

        removeToast: (state, action) => {
            state.toasts = state.toasts.filter(
                (toast) => toast.id !== action.payload
            );
        },

        clearToasts: (state) => {
            state.toasts = [];
        },
    },
});

export const {
    showToast,
    removeToast,
    clearToasts,
} = toastSlice.actions;

export default toastSlice.reducer;