import { configureStore } from '@reduxjs/toolkit'
import habitsReducer from './habit-slice'
import authReducer from './auth-slice';

const store = configureStore({
  reducer: {
    habits: habitsReducer,
    auth: authReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;