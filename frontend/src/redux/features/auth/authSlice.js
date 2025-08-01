import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")) : null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

 const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem("userInfo", JSON.stringify(action.payload))
            const expiryTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
            localStorage.setItem("expiryTime", expiryTime);
        },
        logout: (state) => {
            state.userInfo = null;
            state.isAuthenticated = false;
            localStorage.clear();
        },
    },
});  

export const { setCredentials, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;