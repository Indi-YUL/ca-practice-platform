import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthSession, User, UserPermissions } from "@/domain/models";
import { loadAuthSession, saveAuthSession, clearAuthSession } from "@/lib/authStorage";

const GUEST_USER: User = {
  id: "",
  name: "",
  email: "",
  role: "staff",
  office: "",
  department: "",
};

export interface AuthState {
  currentUser: User;
  username: string | null;
  accountId: string | null;
  permissions: UserPermissions | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const stored = loadAuthSession();

const initialState: AuthState = stored
  ? {
      currentUser: stored.user,
      username: stored.username,
      accountId: stored.accountId,
      permissions: stored.permissions,
      isAdmin: stored.isAdmin,
      isAuthenticated: true,
    }
  : {
      currentUser: GUEST_USER,
      username: null,
      accountId: null,
      permissions: null,
      isAdmin: false,
      isAuthenticated: false,
    };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthSession(state, action: PayloadAction<AuthSession>) {
      state.currentUser = action.payload.user;
      state.username = action.payload.username;
      state.accountId = action.payload.accountId;
      state.permissions = action.payload.permissions;
      state.isAdmin = action.payload.isAdmin;
      state.isAuthenticated = true;
      saveAuthSession(action.payload);
    },
    updatePermissions(state, action: PayloadAction<{ permissions: UserPermissions; isAdmin: boolean }>) {
      state.permissions = action.payload.permissions;
      state.isAdmin = action.payload.isAdmin;
      if (state.accountId && state.currentUser && state.username) {
        saveAuthSession({
          accountId: state.accountId,
          user: state.currentUser,
          username: state.username,
          isAdmin: action.payload.isAdmin,
          permissions: action.payload.permissions,
        });
      }
    },
    logout(state) {
      state.currentUser = GUEST_USER;
      state.username = null;
      state.accountId = null;
      state.permissions = null;
      state.isAdmin = false;
      state.isAuthenticated = false;
      clearAuthSession();
    },
  },
});

export const { setAuthSession, updatePermissions, logout } = authSlice.actions;
