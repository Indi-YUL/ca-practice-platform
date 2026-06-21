import { http, HttpResponse, delay } from "msw";
import { db } from "../db";

export const assignmentHandlers = [
  http.get("/api/assignments", async () => {
    await delay(300);
    return HttpResponse.json(db.assignments.getAll());
  }),

  http.post("/api/assignments", async ({ request }) => {
    await delay(400);
    const body = await request.json() as Record<string, unknown>;
    const now = new Date().toISOString();
    const newAssignment = {
      id: `a${Date.now()}`,
      tasks: [],
      comments: [],
      worklogs: [],
      status: "not_started",
      createdAt: now,
      updatedAt: now,
      ...body,
    };
    db.assignments.create(newAssignment as any);
    return HttpResponse.json(newAssignment, { status: 201 });
  }),

  http.get("/api/assignments/:id", async ({ params }) => {
    await delay(200);
    const assignment = db.assignments.getById(params.id as string);
    if (!assignment) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(assignment);
  }),

  http.patch("/api/assignments/:id", async ({ params, request }) => {
    await delay(300);
    const body = await request.json() as Record<string, unknown>;
    const updated = db.assignments.update(params.id as string, body as any);
    if (!updated) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(updated);
  }),

  http.post("/api/assignments/:id/comments", async ({ params, request }) => {
    await delay(300);
    const comment = await request.json() as Record<string, unknown>;
    const assignment = db.assignments.getById(params.id as string);
    if (!assignment) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    const newComment = { id: `cm-${Date.now()}`, ...comment };
    assignment.comments.push(newComment as any);
    db.assignments.update(params.id as string, { comments: assignment.comments });
    return HttpResponse.json(newComment, { status: 201 });
  }),

  http.post("/api/assignments/:id/worklogs", async ({ params, request }) => {
    await delay(300);
    const worklog = await request.json() as Record<string, unknown>;
    const assignment = db.assignments.getById(params.id as string);
    if (!assignment) return HttpResponse.json({ error: "Not found" }, { status: 404 });
    const newWorklog = { id: `w-${Date.now()}`, ...worklog };
    assignment.worklogs.push(newWorklog as any);
    db.assignments.update(params.id as string, { worklogs: assignment.worklogs });
    return HttpResponse.json(newWorklog, { status: 201 });
  }),
];
