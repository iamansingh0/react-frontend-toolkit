import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api/api";

export interface Habit {
    id: string;
    name: string;
    frequency: "daily" | "weekly";
    completedDates: string[];
    createdAt: string;
}

interface HabitState {
    habits: Habit[];
    isLoading: boolean;
    error: string | null;
}

const initialState: HabitState = {
    habits: [],
    isLoading: false,
    error: null
};

interface HabitResponse {
    _id: string;
    name: string;
    frequency: "daily" | "weekly";
    completedDates: string[];
    createdAt: string;
}

// Helper to transform MongoDB document to our Habit interface
const transformHabit = (habitDoc: HabitResponse): Habit => ({
    id: habitDoc._id,
    name: habitDoc.name,
    frequency: habitDoc.frequency,
    completedDates: habitDoc.completedDates,
    createdAt: habitDoc.createdAt
});

// Fetch habits from API
export const fetchHabits = createAsyncThunk<Habit[]>(
    "habits/fetchHabits",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<HabitResponse[]>("/habits");
            return response.data.map(transformHabit);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch habits");
        }
    }
);

// Add a new habit
export const addHabit = createAsyncThunk<Habit, { name: string, frequency: "daily" | "weekly" }>(
    "habits/addHabit",
    async (habitData, { rejectWithValue }) => {
        try {
            const res = await api.post<HabitResponse>("/habits", habitData);
            return transformHabit(res.data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to add habit");
        }
    }
);

// toggle habit completion
export const toggleHabit = createAsyncThunk<
    { id: string; completedDates: string[] },
    { id: string; date: string }
>(
    "habits/toggleHabit",
    async (data, { rejectWithValue }) => {
        try {
            const response = await api.patch<HabitResponse>(
                `/habits/${data.id}/toggle`,
                { date: data.date }
            );
            return {
                id: response.data._id,
                completedDates: response.data.completedDates
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to toggle habit");
        }
    }
);

// Remove a habit
export const removeHabit = createAsyncThunk<
    string,
    { id: string }
>(
    "habits/removeHabit",
    async (data, { rejectWithValue }) => {
        try {
            await api.delete(`/habits/${data.id}`);
            return data.id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to remove habit");
        }
    }
);

const habitSlice = createSlice({
    name: "habits",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetch habits cases
            .addCase(fetchHabits.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchHabits.fulfilled, (state, action) => {
                state.isLoading = false;
                state.habits = action.payload;
            })
            .addCase(fetchHabits.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || "Failed to fetch habits";
            })

            // add habit cases
            .addCase(addHabit.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addHabit.fulfilled, (state, action) => {
                state.isLoading = false;
                state.habits.push(action.payload);
            })
            .addCase(addHabit.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string || "Failed to add habit";
            })

            // toggle habit cases
            .addCase(toggleHabit.fulfilled, (state, action) => {
                const habit = state.habits.find((h) => h.id === action.payload.id);
                if (habit) {
                    habit.completedDates = action.payload.completedDates;
                }
            })
            .addCase(toggleHabit.rejected, (state, action) => {
                state.error = action.payload as string || "Failed to toggle habit";
            })
            
            // Remove habit cases
            .addCase(removeHabit.fulfilled, (state, action) => {
                state.habits = state.habits.filter(
                    (habit) => habit.id !== action.payload
                );
            })
            .addCase(removeHabit.rejected, (state, action) => {
                state.error = action.payload as string || "Failed to remove habit";
            });
    }
});

export default habitSlice.reducer;