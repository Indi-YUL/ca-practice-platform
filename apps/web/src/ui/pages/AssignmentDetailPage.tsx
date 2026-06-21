import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { useGetAssignmentByIdQuery, useUpdateAssignmentMutation, useAddCommentMutation } from "@/store/api/assignmentApi";
import type { AssignmentStatus, Comment } from "@/domain/models";
import { cn } from "@/lib/utils";
import { ArrowLeft, CheckCircle2, Circle, MessageSquare, Clock, Send, User } from "lucide-react";

const STATUS_FLOW: AssignmentStatus[] = ["not_started", "in_progress", "completed", "reviewed", "billed"];

export function AssignmentDetailPage() {
  const { id } = useParams();
  const { currentUser } = useAppSelector((state) => state.auth);
  const { data: assignment, isLoading } = useGetAssignmentByIdQuery(id!);
  const [updateAssignment] = useUpdateAssignmentMutation();
  const [addComment] = useAddCommentMutation();
  const [commentText, setCommentText] = useState("");
  const [commentType, setCommentType] = useState<Comment["type"]>("note");

  if (isLoading) return <div className="flex items-center justify-center p-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  if (!assignment) return <div className="p-8 text-center text-muted-foreground">Assignment not found.</div>;

  const completedTasks = assignment.tasks.filter((t) => t.completed).length;
  const totalHours = assignment.worklogs.reduce((sum, w) => sum + w.hours, 0);

  function handleStatusChange(status: AssignmentStatus) {
    updateAssignment({ id: assignment!.id, patch: { status, updatedAt: new Date().toISOString().split("T")[0] } });
  }

  function handleToggleTask(taskId: string) {
    const tasks = assignment!.tasks.map((t) => t.id === taskId ? { ...t, completed: !t.completed } : t);
    updateAssignment({ id: assignment!.id, patch: { tasks } });
  }

  function handleAddComment() {
    if (!commentText.trim()) return;
    addComment({
      assignmentId: assignment!.id,
      comment: { userId: currentUser.id, userName: currentUser.name, type: commentType, text: commentText, createdAt: new Date().toISOString().split("T")[0] },
    });
    setCommentText("");
  }

  return (
    <div className="space-y-6">
      <Link to="/assignments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Assignments
      </Link>

      <div className="rounded-lg border bg-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{assignment.clientName}</h1>
              <PriorityBadge priority={assignment.priority} />
            </div>
            <p className="text-muted-foreground">{assignment.serviceName} · {assignment.period}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> Assigned to: <strong className="text-foreground">{assignment.assigneeName}</strong></span>
              {assignment.assignedByName && <span>By: <strong className="text-foreground">{assignment.assignedByName}</strong></span>}
              {assignment.reviewerName && <span>Reviewer: <strong className="text-foreground">{assignment.reviewerName}</strong></span>}
              <span>Due: <strong className={cn(assignment.dueDate < new Date().toISOString().split("T")[0] ? "text-red-500" : "text-foreground")}>{assignment.dueDate}</strong></span>
            </div>
          </div>
          <StatusBadgeLarge status={assignment.status} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {STATUS_FLOW.filter((s) => s !== assignment.status).map((s) => (
            <button key={s} onClick={() => handleStatusChange(s)}
              className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors">
              Move to: {s.replace(/_/g, " ")}
            </button>
          ))}
          {!["query_hold", "waiting_for_info"].includes(assignment.status) && (
            <>
              <button onClick={() => handleStatusChange("query_hold" as AssignmentStatus)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                Query / Hold
              </button>
              <button onClick={() => handleStatusChange("waiting_for_info" as AssignmentStatus)}
                className="rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-orange-50">
                Waiting for Info
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="font-semibold">Checklist</h2>
            <span className="text-sm text-muted-foreground">{completedTasks}/{assignment.tasks.length}</span>
          </div>
          <div className="p-4 space-y-2">
            {assignment.tasks.map((task) => (
              <button key={task.id} onClick={() => handleToggleTask(task.id)}
                className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted/50">
                {task.completed ? <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" /> : <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />}
                <span className={cn("text-sm", task.completed && "line-through text-muted-foreground")}>{task.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /><span>Time Logged</span></div>
            <p className="mt-1 text-2xl font-bold">{totalHours}h</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Progress</p>
            <div className="mt-2 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${assignment.tasks.length ? (completedTasks / assignment.tasks.length) * 100 : 0}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{Math.round(assignment.tasks.length ? (completedTasks / assignment.tasks.length) * 100 : 0)}% complete</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex items-center gap-2 border-b p-4">
          <MessageSquare className="h-4 w-4" />
          <h2 className="font-semibold">Comments & Remarks</h2>
        </div>
        <div className="divide-y">
          {assignment.comments.map((c) => (
            <div key={c.id} className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{c.userName}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-xs", typeColor(c.type))}>{c.type.replace(/_/g, " ")}</span>
                <span className="text-xs text-muted-foreground">{c.createdAt}</span>
              </div>
              <p className="mt-1 text-sm">{c.text}</p>
            </div>
          ))}
          {assignment.comments.length === 0 && <p className="p-4 text-sm text-muted-foreground">No comments yet.</p>}
        </div>
        <div className="border-t p-4">
          <div className="flex gap-2 mb-2">
            {(["note", "query", "resolution", "review_remark"] as const).map((type) => (
              <button key={type} onClick={() => setCommentType(type)}
                className={cn("rounded-full px-2.5 py-1 text-xs font-medium border", commentType === type ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted")}>
                {type.replace(/_/g, " ")}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <button onClick={handleAddComment} className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadgeLarge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    not_started: "bg-gray-100 text-gray-700 border-gray-200",
    in_progress: "bg-yellow-100 text-yellow-700 border-yellow-200",
    query_hold: "bg-red-100 text-red-700 border-red-200",
    waiting_for_info: "bg-orange-100 text-orange-700 border-orange-200",
    completed: "bg-green-100 text-green-700 border-green-200",
    reviewed: "bg-purple-100 text-purple-700 border-purple-200",
    billed: "bg-blue-100 text-blue-700 border-blue-200",
  };
  return <span className={cn("rounded-lg border px-3 py-1.5 text-sm font-medium", styles[status] || "bg-gray-100")}>{status.replace(/_/g, " ")}</span>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = { high: "bg-red-100 text-red-700", medium: "bg-yellow-100 text-yellow-700", low: "bg-green-100 text-green-700" };
  return <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", styles[priority])}>{priority}</span>;
}

function typeColor(type: string): string {
  const map: Record<string, string> = { note: "bg-gray-100 text-gray-700", query: "bg-red-100 text-red-700", resolution: "bg-green-100 text-green-700", review_remark: "bg-purple-100 text-purple-700" };
  return map[type] || "bg-gray-100 text-gray-700";
}
