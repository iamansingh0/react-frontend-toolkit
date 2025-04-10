import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const API_URL = "https://habit-tracker-api-fpas.onrender.com/api";

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
    async () => {
        const response = await axios.get<HabitResponse[]>(`${API_URL}/habits`);
        return response.data.map(transformHabit);
    }
);

// Add a new habit
export const addHabit = createAsyncThunk<Habit, { name: string, frequency: "daily" | "weekly" }>(
    "habits/addHabit",
    async (habitData) => {
        const res = await axios.post<HabitResponse>(`${API_URL}/habits`, habitData);
        return transformHabit(res.data)
    }
)

// toggle habit completion
export const toggleHabit = createAsyncThunk<
    { id: string; completedDates: string[] },
    { id: string; date: string }
>(
    "habits/toggleHabit",
    async (data) => {
        const response = await axios.patch<HabitResponse>(
            `${API_URL}/habits/${data.id}/toggle`,
            { date: data.date }
        );
        return {
            id: response.data._id,
            completedDates: response.data.completedDates
        };
    }
);

// Remove a habit
export const removeHabit = createAsyncThunk<
    string,
    { id: string }
>(
    "habits/removeHabit",
    async (data) => {
        await axios.delete(`${API_URL}/habits/${data.id}`);
        return data.id;
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
                state.error = action.error.message || "Failed to fetch habits";
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
                state.error = action.error.message || "Failed to add habit";
            })

            // toggle habit cases
            .addCase(toggleHabit.fulfilled, (state, action) => {
                const habit = state.habits.find((h) => h.id === action.payload.id);
                if (habit) {
                    habit.completedDates = action.payload.completedDates;
                }
            })
            // Remove habit cases
            .addCase(removeHabit.fulfilled, (state, action) => {
                state.habits = state.habits.filter(
                    (habit) => habit.id !== action.payload
                );
            });
    }
})

export default habitSlice.reducer;