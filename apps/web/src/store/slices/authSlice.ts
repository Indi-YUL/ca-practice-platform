import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, UserRole } from "@/domain/models";
import { users, currentUserIds } from "@/mocks/users";

interface AuthState {
  currentUser: User;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUser: users.find((u) => u.id === currentUserIds.partner)!,
  isAuthenticated: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    switchRole(state, action: PayloadAction<UserRole>) {
      const userId = currentUserIds[action.payload as keyof typeof currentUserIds];
      const user = users.find((u) => u.id === userId);
      if (user) {
        state.currentUser = user;
      }
    },
    login(state, action: PayloadAction<string>) {
      const user = users.find((u) => u.id === action.payload);
      if (user) {
        state.currentUser = user;
        state.isAuthenticated = true;
      }
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

export const { switchRole, login, logout } = authSlice.actions;
