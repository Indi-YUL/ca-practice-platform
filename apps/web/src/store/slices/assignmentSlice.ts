import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Assignment, AssignmentStatus, Comment, Worklog } from "@/domain/models";
import { assignments as initialAssignments } from "@/mocks/assignments";

interface AssignmentState {
  items: Assignment[];
}

const initialState: AssignmentState = {
  items: initialAssignments,
};

export const assignmentSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    updateStatus(state, action: PayloadAction<{ id: string; status: AssignmentStatus }>) {
      const assignment = state.items.find((a) => a.id === action.payload.id);
      if (assignment) {
        assignment.status = action.payload.status;
        assignment.updatedAt = new Date().toISOString().split("T")[0];
      }
    },
    toggleTask(state, action: PayloadAction<{ assignmentId: string; taskId: string }>) {
      const assignment = state.items.find((a) => a.id === action.payload.assignmentId);
      if (assignment) {
        const task = assignment.tasks.find((t) => t.id === action.payload.taskId);
        if (task) task.completed = !task.completed;
      }
    },
    addComment(state, action: PayloadAction<{ assignmentId: string; comment: Comment }>) {
      const assignment = state.items.find((a) => a.id === action.payload.assignmentId);
      if (assignment) {
        assignment.comments.push(action.payload.comment);
      }
    },
    addWorklog(state, action: PayloadAction<{ assignmentId: string; worklog: Worklog }>) {
      const assignment = state.items.find((a) => a.id === action.payload.assignmentId);
      if (assignment) {
        assignment.worklogs.push(action.payload.worklog);
      }
    },
  },
});

export const { updateStatus, toggleTask, addComment, addWorklog } = assignmentSlice.actions;
