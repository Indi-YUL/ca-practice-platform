import { baseApi } from "./baseApi";
import type { Assignment, Comment, Worklog } from "@/domain/models";

export const assignmentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAssignments: build.query<Assignment[], void>({
      query: () => "/assignments",
      providesTags: ["Assignment"],
    }),
    createAssignment: build.mutation<Assignment, Partial<Assignment>>({
      query: (body) => ({ url: "/assignments", method: "POST", body }),
      invalidatesTags: ["Assignment"],
    }),
    getAssignmentById: build.query<Assignment, string>({
      query: (id) => `/assignments/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Assignment", id }],
    }),
    updateAssignment: build.mutation<Assignment, { id: string; patch: Partial<Assignment> }>({
      query: ({ id, patch }) => ({ url: `/assignments/${id}`, method: "PATCH", body: patch }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Assignment", id }, "Assignment"],
    }),
    addComment: build.mutation<Comment, { assignmentId: string; comment: Omit<Comment, "id"> }>({
      query: ({ assignmentId, comment }) => ({ url: `/assignments/${assignmentId}/comments`, method: "POST", body: comment }),
      invalidatesTags: (_r, _e, { assignmentId }) => [{ type: "Assignment", id: assignmentId }, "Assignment"],
    }),
    addWorklog: build.mutation<Worklog, { assignmentId: string; worklog: Omit<Worklog, "id"> }>({
      query: ({ assignmentId, worklog }) => ({ url: `/assignments/${assignmentId}/worklogs`, method: "POST", body: worklog }),
      invalidatesTags: (_r, _e, { assignmentId }) => [{ type: "Assignment", id: assignmentId }, "Assignment"],
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useGetAssignmentByIdQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useAddCommentMutation,
  useAddWorklogMutation,
} = assignmentApi;
