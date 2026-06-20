import { baseApi } from "./baseApi";
import type { ServiceMaster } from "@/domain/models";

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getServices: build.query<ServiceMaster[], void>({
      query: () => "/services",
      providesTags: ["Service"],
    }),
    getServiceById: build.query<ServiceMaster, string>({
      query: (id) => `/services/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Service", id }],
    }),
    createService: build.mutation<ServiceMaster, Partial<ServiceMaster>>({
      query: (body) => ({ url: "/services", method: "POST", body }),
      invalidatesTags: ["Service"],
    }),
    updateService: build.mutation<ServiceMaster, { id: string; patch: Partial<ServiceMaster> }>({
      query: ({ id, patch }) => ({ url: `/services/${id}`, method: "PATCH", body: patch }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Service", id }, "Service"],
    }),
  }),
});

export const { useGetServicesQuery, useGetServiceByIdQuery, useCreateServiceMutation, useUpdateServiceMutation } = serviceApi;
