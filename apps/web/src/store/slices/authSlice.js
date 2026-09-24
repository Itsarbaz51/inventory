import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
    initialized: false,
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },

        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },

        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },

        setAuthInitialized: (state, action) => {
            state.initialized = action.payload;
        },
    },
});

export const {
    setCredentials,
    setUser,
    clearAuth,
    setAuthInitialized,
} = authSlice.actions;

export default authSlice.reducer;