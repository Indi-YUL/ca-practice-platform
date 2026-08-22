import { baseApi } from "./baseApi";
import type { Staff } from "@/domain/models";

export const staffApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStaff: build.query<Staff[], void>({
      query: () => "/staff",
      providesTags: ["Staff"],
    }),
    getStaffById: build.query<Staff, string>({
      query: (id) => `/staff/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Staff", id }],
    }),
    createStaff: build.mutation<Staff, {
      userId: string;
      employeeId: string;
      phone: string;
      dateOfJoining: string;
      designation: string;
      employmentType: "full_time" | "articleship" | "intern";
      reportingManagerId?: string;
      departments: string[];
      services: string[];
      bankDetails?: Staff["bankDetails"];
    }>({
      query: (body) => ({ url: "/staff", method: "POST", body }),
      invalidatesTags: ["Staff"],
    }),
    updateStaff: build.mutation<Staff, { id: string; patch: Partial<Staff> }>({
      query: ({ id, patch }) => ({ url: `/staff/${id}`, method: "PATCH", body: patch }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Staff", id }, "Staff"],
    }),
  }),
});

export const { useGetStaffQuery, useGetStaffByIdQuery, useCreateStaffMutation, useUpdateStaffMutation } = staffApi;
