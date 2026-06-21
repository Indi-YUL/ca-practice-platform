import { baseApi } from "./baseApi";
import type { Client } from "@/domain/models";

export const clientApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getClients: build.query<Client[], void>({
      query: () => "/clients",
      providesTags: ["Client"],
    }),
    getClientById: build.query<Client, string>({
      query: (id) => `/clients/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Client", id }],
    }),
    createClient: build.mutation<Client, Partial<Client>>({
      query: (body) => ({ url: "/clients", method: "POST", body }),
      invalidatesTags: ["Client"],
    }),
    updateClient: build.mutation<Client, { id: string; patch: Partial<Client> }>({
      query: ({ id, patch }) => ({ url: `/clients/${id}`, method: "PATCH", body: patch }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Client", id }, "Client"],
    }),
  }),
});

export const { useGetClientsQuery, useGetClientByIdQuery, useCreateClientMutation, useUpdateClientMutation } = clientApi;
