import { baseApi } from "./baseApi";
import type { AuthSession } from "@/domain/models";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthSession, { username: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    restoreSession: builder.query<AuthSession, string>({
      query: (accountId) => `/auth/session/${accountId}`,
    }),
    changePassword: builder.mutation<
      { success: boolean },
      { accountId: string; currentPassword: string; newPassword: string }
    >({
      query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
    }),
  }),
});

export const { useLoginMutation, useRestoreSessionQuery, useChangePasswordMutation } = authApi;
