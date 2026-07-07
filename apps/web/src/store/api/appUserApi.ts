import { baseApi } from "./baseApi";
import type { AppUserAccount, UserPermissions } from "@/domain/models";

export interface AppUserListItem extends Omit<AppUserAccount, "password"> {
  name: string;
  email: string;
  role: string;
  office: string;
  department: string;
}

export const appUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAppUsers: builder.query<AppUserListItem[], void>({
      query: () => "/app-users",
      providesTags: ["AppUser"],
    }),
    createAppUser: builder.mutation<
      AppUserListItem,
      {
        userId?: string;
        name?: string;
        email?: string;
        role?: string;
        office?: string;
        department?: string;
        username: string;
        password?: string;
        isAdmin?: boolean;
        permissions?: UserPermissions;
        status?: AppUserAccount["status"];
      }
    >({
      query: (body) => ({ url: "/app-users", method: "POST", body }),
      invalidatesTags: ["AppUser"],
    }),
    updateAppUser: builder.mutation<
      AppUserListItem,
      { id: string; patch: Partial<AppUserAccount> & { password?: string } }
    >({
      query: ({ id, patch }) => ({ url: `/app-users/${id}`, method: "PATCH", body: patch }),
      invalidatesTags: ["AppUser"],
    }),
  }),
});

export const { useGetAppUsersQuery, useCreateAppUserMutation, useUpdateAppUserMutation } = appUserApi;
