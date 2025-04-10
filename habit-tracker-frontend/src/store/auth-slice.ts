import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

interface User {
    id: string;
    name: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
    };
}

// Initial state
const initialState: AuthState = {
    token: localStorage.getItem("token"),
    user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null,
    isAuthenticated: !!localStorage.getItem("token"),
    isLoading: false,
    error: null,
};

//login
export const login = createAsyncThunk<AuthResponse, LoginCredentials>("auth/login", async (credentials) => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
})

//register
export const register = createAsyncThunk<
    { message: string },
    RegisterCredentials
>("auth/register", async (credentials) => {
    const response = await api.post<{ message: string; user: User }>(
        "/auth/register",
        credentials
    );
    return response.data;
});

// Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
    },
    extraReducers: (builder) => {
        builder
            // login cases
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Login failed";
            })
            // register cases
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Registration failed";
            });
    },
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;