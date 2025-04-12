import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

interface User {
    id: string;
    name: string;
    email: string;
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
        email: string;
    };
}

interface UpdatePasswordData {
    currentPassword: string;
    newPassword: string;
}

interface UpdateEmailData {
    password: string;
    newEmail: string;
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
    console.log(`hi: ${response.data}`);
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

// update password
export const updatePassword = createAsyncThunk<
    { message: string },
    UpdatePasswordData
>(
    "auth/updatePassword",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.put<{ message: string }>(
                "/auth/update-password",
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to update password");
        }
    }
);

// Update Email
export const updateEmail = createAsyncThunk<
    { message: string; newEmail: string },
    UpdateEmailData
>(
    "auth/updateEmail",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.put<{ message: string; newEmail: string }>(
                "/auth/update-email",
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || "Failed to update email");
        }
    }
);

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
                if (action.error.message?.includes('401')) {
                    state.error = 'Invalid Credentials'
                } else if (action.error.message?.includes('400')) {
                    state.error = 'User does not exist.'
                } else if (action.error.message?.includes('500')) {
                    state.error = 'Login Failed. Try Again!'
                } else {
                    state.error = action.error.code || "Login failed";
                }
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
                if (action.error.message?.includes('400')) {
                    state.error = 'User already exists.'
                } else if (action.error.message?.includes('500')) {
                    state.error = 'Registration failed. Try Again!'
                } else {
                    state.error = action.error.message || "Registration failed";
                }
            })
            // Update Password cases
            .addCase(updatePassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(updatePassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })

            // Update Email cases
            .addCase(updateEmail.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateEmail.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.user && action.payload.newEmail) {
                    state.user = {
                        ...state.user,
                        email: action.payload.newEmail
                    };
                    localStorage.setItem("user", JSON.stringify(state.user));
                }
            })
            .addCase(updateEmail.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;