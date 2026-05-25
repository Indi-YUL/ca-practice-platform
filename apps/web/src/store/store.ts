import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/authSlice";
import { assignmentSlice } from "./slices/assignmentSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    assignments: assignmentSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
